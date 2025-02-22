import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import User from './User';
import CartItem from './CartItem';
import calcTotal from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

const LOCAL_STATE_QUERY = gql`
    query LOCAL_STATE_QUERY {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation TOGGLE_CART_MUTATION {
        toggleCart @client
    }
`;

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render })=> <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = (props) => {
    return (
        <Composed>
            {
                ({user, toggleCart, localState}) => {
                    const me = user.data.me;
                    if(!me) return null;
                    return (
                        <CartStyles open={localState.data.cartOpen}>
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
                                {
                                    me.cart.length && (
                                        <TakeMyMoney>
                                            <SickButton>Checkout</SickButton>
                                        </TakeMyMoney>
                                    )
                                }
                            </footer>
                        </CartStyles>
                                        
                    )
                }
            }
        </Composed>
        
    )
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
