import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import CartItem from './CartItem';
import calcTotal from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query LOCAL_STATE_QUERY {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation TOGGLE_CART_MUTATION {
        toggleCart @client
    }
`

const Cart = (props) => {
    return (
        <User>
            {({ data: { me }}) => {
                if(!me) return null;
                return (
                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                        {
                            (toggleCart) => (
                                <Query query={LOCAL_STATE_QUERY}>
                                    {
                                        ({data}) => (
                                            <CartStyles open={data.cartOpen}>
                                                <header>
                                                    <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                                                    <Supreme>{me.name}'s cart</Supreme>
                                                    <p>You have {me.cart.length} items in your cart</p>
                                                </header>
                                                <React.Fragment>
                                                    {me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem}/>)}
                                                </React.Fragment>
                                                <footer>
                                                    <p>{formatMoney(calcTotal(me.cart))}</p>
                                                    <SickButton>Checkout</SickButton>
                                                </footer>
                                            </CartStyles>
                                        )
                                    }
                                </Query>
                            )
                        }
                    </Mutation>
                )
            }}
        </User>
        
    )
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
