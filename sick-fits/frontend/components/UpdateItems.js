import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
        }
    }
`;

class UpdateItems extends Component {
    state = {
        title: 'title',
        description: 'new item',
        image: 'image.jpeg',
        largeImage: 'large-image.jpeg',
        price: 1000
    }

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val});
    }
    updateItems = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log(this.state);
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        })
    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}}>
                {
                    ({data, loading}) => {
                        if(loading) return <p>Loading...</p>
                        if(!data.item) return <p>No data found for ID</p>
                        return (
                            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                                {(updateItem, { loading, error }) => (
                                    <Form onSubmit={e => this.updateItems(e, updateItem)}>
                                        <Error error={error} />
                                        <fieldset disabled={loading} aria-busy={loading}>
                                            <label htmlFor="title">
                                                Title
                                                <input type="text" name="title" id="title" placeholder="Title" required defaultValue={data.item.title} onChange={this.handleChange}/>
                                            </label>
                                            <label htmlFor="price">
                                                Price
                                                <input type="number" name="price" id="price" placeholder="Price" required defaultValue={data.item.price} onChange={this.handleChange}/>
                                            </label>
                                            <label htmlFor="description">
                                                Description
                                                <textarea name="description" id="description" placeholder="Description" required defaultValue={data.item.description} onChange={this.handleChange}/>
                                            </label>
                                            <button type="submit">Sav{loading ? 'ing' : 'e' } Changes</button>
                                        </fieldset>
                                    </Form>
                                )}
                            </Mutation>
                        )
                    }
                }
            </Query>
            
        );
    }
}

export default UpdateItems;
export { UPDATE_ITEM_MUTATION };