import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItems extends Component {
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

    uploadFile = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/siddharth/image/upload',
        {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Image
                                <input type="file" name="file" id="file" placeholder="Upload an image" onChange={this.uploadFile}/>
                                {this.state.image && <img width="200" src={this.state.image} alt="Uploaded image" />}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input type="text" name="title" id="title" placeholder="Title" required value={this.state.title} onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="price">
                                Price
                                <input type="number" name="price" id="price" placeholder="Price" required value={this.state.price} onChange={this.handleChange}/>
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea name="description" id="description" placeholder="Description" required value={this.state.description} onChange={this.handleChange}/>
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export default CreateItems;
export { CREATE_ITEM_MUTATION };