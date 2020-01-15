import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';
import gql from 'graphql-tag';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`

class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    render() {
        const { id } = this.props;
        return (
            <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id }}>
                {
                    (removeFromCart, { loading, error }) => (
                        <BigButton onClick={() => {
                                removeFromCart().catch(err => alert(err.message));
                            }} 
                            disabled={loading} 
                            title="Delete item">
                            &times;
                        </BigButton>
                    )
                }
            </Mutation>
        );
    }
}

export default RemoveFromCart;