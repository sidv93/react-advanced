import React, { Component } from 'react';
import PropType from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

class Order extends Component {
    static propTypes = {
        id: PropType.string.isRequired
    }

    render() {
        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id}}>
                {
                    ({ data, error, loading }) => {
                        if(error) return <Error error={error} />
                        if(loading) return <p>Loading...</p>
                        const order = data.order;
                        <OrderStyles>
                            <Head>
                                <title>Sick Fits -- {order.id}</title>
                            </Head>
                            <p>
                                <span>Order ID</span> 
                                <span>{order.id}</span>
                            </p>
                            <p>
                                <span>Charge</span> 
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date</span> 
                                <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                            </p>
                            <p>
                                <span>Total</span> 
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Item Count</span> 
                                <span>{order.items.length}</span>
                            </p>
                            <div className="items">
                                {
                                    order.items.map(item => (
                                        <div className="order-item" key={item.id}>
                                            <img src={item.image} alt={item.title} />
                                            <div className="item-details">
                                                <h2>{item.details}</h2>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Each: {formatMoney(item.price)}</p>
                                                <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </OrderStyles>
                    }
                }
            </Query>
        );
    }
}

export default Order;