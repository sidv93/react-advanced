import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, password: $password, name: $name) {
            id
            name
            email
        }
    }
`;

class Signup extends Component {
    state = {
        email: '',
        name: '',
        password: '',
    };

    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
                {
                    (signup, {error, loading}) => {
                        return <Form method="post" onSubmit={ async (e) => {
                                e.preventDefault();
                                await signup();
                                this.setState({ email: '', name: '', password: '' });
                            }}>
                            <fieldset disable={loading} aria-busy={loading}>
                                <h2>Signup for an account</h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    Email
                                    <input type="email" name="email" value={this.state.email} placeholder="email" onChange={this.saveToState} />
                                </label>
                                <label htmlFor="name">
                                    Name
                                    <input type="text" name="name" value={this.state.name} placeholder="name" onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">
                                    Password
                                    <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.saveToState} />
                                </label>
                                <button type="submit">Signup</button>
                            </fieldset>
                        </Form>
                    }
                }
            </Mutation>
        );
    }
}

export default Signup;