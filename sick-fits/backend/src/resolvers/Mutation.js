const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeEmail } = require('../mail');
const { hasPermission } = require('../utils');

const YEAR_MS = 1000 * 60 * 60 * 24 * 365;

const mutations = {
    async createItem(parent, args, ctx, info) {
        if(!ctx.request.userId) {
            throw new Error('You must be logged in');
        }
        const item = await ctx.db.mutation.createItem({
            data: {
                user: {
                    connect: {
                        id: ctx.request.userId
                    }
                },
                ...args
            }
        }, info);
        return item;
    },

    updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        delete updates.id;
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        const item = await ctx.db.query.item({ where }, `{ id title user { id }}`);
        const ownsItem = ctx.request.userId === item.user.id;
        const hasPermissions = ctx.request.user.permissions.some(
            permission => ['ADMIN', "DELETEITEM"].includes(permission)
        );
        if(!ownsItem || !hasPermissions) {
            throw new Error('You do not have permission to delete');
        }
        return ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: YEAR_MS
        });

        return user;
    },

    async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email }});
        if(!user) {
            throw new Error('No such user found');
        }
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: YEAR_MS
        });
        return user;
    },

    async signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { message: 'Logged out'};
    },

    async requestReset(parent, args, ctx, info) {
        const user = await ctx.db.query.user({ where: { email: args.email }});
        if(!user) {
            throw new Error('No user found');
        }

        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        });

        const mailRes = await transport.sendMail({
            from: 'siddhuv93@gmail.com',
            to: user.email,
            subject: 'Your Reset password link',
            html: makeEmail(`
                Your reset password link is here!
                \n \n
                <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset!</a>
            `)
        })
        return { message: 'Thanks' };
    },

    async resetPassword(parent, args, ctx, info) {
        if(args.password !== args.confirmPassword) {
            throw new Error('Password does not match');
        }

        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });
        if(!user) {
            throw new Error('This token is not valid or expired');
        }

        const password = await bcrypt.hash(args.password, 10);
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: YEAR_MS
        });

        return updatedUser;
    },

    async updatePermissions(parent, args, ctx, info) {
        if(!ctx.request.userId) {
            throw new Error('You have to be logged in');
        }

        const user = await ctx.db.query.user({
            where: { id: ctx.request.userId }
        }, info);

        hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.mutation.updateUser({
            data: {
                permissions: {
                    set: args.permissions
                }
            },
            where: {
                id: args.userId
            }
        }, info);
    },

    async addToCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if(!userId) {
            throw new Error('You have to be logged in');
        }

        const [ existingCartItem ] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        });
        if(existingCartItem) {
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            }, info);
        }
        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info)
    },

    async removeFromCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if(!userId) {
            throw new Error('You have to be logged in');
        }
        const cartItem = await ctx.db.query.cartItem({
            where: { id: args.id }
        }, `{ id, user { id }}`);
        if(!cartItem) throw new Error('No such item in cart');
        if(cartItem.user.id !== ctx.request.userId) {
            throw new Error('Item does not belong to the users cart');
        }
        return ctx.db.mutation.deleteCartItem({
            where: {
                id: args.id
            }
        }, info);
    }
};

module.exports = mutations;