import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import styled from 'styled-components';

const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(prderBy: createdAt_DESC) {
            id
            total
            charge
            createdAt
            items {
                id
                title
                price
                description
                image
                quantity
            }
        }
    }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class OrderList extends Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
                {
                    ({ data: { orders }, error, loading}) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <Error error={error} />
                        return (
                            <Fragment>
                                <h2>You have {orders.length} orders!</h2>
                                <OrderUl>
                                    {orders.map(order => (
                                        <OrderItemStyles key={order.id}>
                                            <Link href={{ pathname: '/order', query: { id: order.id }}}>
                                                <a>
                                                    <div className="order-meta">
                                                        <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                                                        <p>{order.items.length} products</p>
                                                        <p>{formatDistance(order.createdAt, new Date())}</p>
                                                        <p>{formatMoney(order.total)}</p>
                                                    </div>
                                                    <div className="images">
                                                        {order.items.map(item => (
                                                            <img src={item.image} key={item.id} alt={item.title} />
                                                        ))}
                                                    </div>
                                                </a>
                                            </Link>
                                        </OrderItemStyles>
                                    ))}
                                </OrderUl>
                            </Fragment>
                        )
                    }
                }
            </Query>
        );
    }
}

export default OrderList;