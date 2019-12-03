const { Prisma } = require('prisma-binding');

const db = new Prisma({
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    typeDefs: 'src/generated/prisma.graphql',
    debug: false,
});

module.exports = db;