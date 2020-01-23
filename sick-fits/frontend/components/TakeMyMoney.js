import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            item {
                id
                title
            }
        }
    }
`;

function totalItems(cart) {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
}

class TakeMyMoney extends Component {
    onToken = async (res, createOrder) => {
        console.log(res.id);
        const order = await createOrder({
            variables: {
                token: res.id
            }
        }).catch(err => alert(err.message));
        console.log(order);
    }

    render() {
        return (
            <User>
                {
                    ({ data: { me }}) => 
                        <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY}]}>
                            {
                                (createOrder, { error, loading }) => (
                                    <StripeCheckout
                                        amount={calcTotalPrice(me.cart)}
                                        name="Sick fits"
                                        description={`Order of ${totalItems(me.cart)}`}
                                        image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                        stripeKey="key"
                                        currency="USD"
                                        email={me.email}
                                        token={res => this.onToken(res, createOrder)}>
                                        {this.props.children}
                                    </StripeCheckout>
                                )
                            }
                        </Mutation>
                }
            </User>
        );
    }
}

export default TakeMyMoney;