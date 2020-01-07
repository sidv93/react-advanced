import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const PERMISSIONS = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            name
            email
            permissions
        }
    }
`;

const Permission = props => (
    <Query query={ALL_USERS_QUERY}>
        {
            ({ data, loading, error}) => (
                <div>
                    <Error error={error} />
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {PERMISSIONS.map(permission => <th key={permission}>{permission}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <UserPermissions key={user.id} user={user} />)}
                        </tbody>
                    </Table>
                </div>
            )
        }
    </Query>
);

class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            email: PropTypes.string,
            permissions: PropTypes.array
        }).isRequired
    }

    state = {
        permissions: this.props.user.permissions
    }

    handlePermissionChange = e => {
        const checkbox = e.target;
        let updatedPermissions = [ ...this.state.permissions ];
        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
        }

        this.setState({ permissions: updatedPermissions });
    }

    render() {
        const user = this.props.user;
        return (
            <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{
                permissions: this.state.permissions,
                userId: this.props.user.id
            }}>
                {
                    (updatePermissions, { loading, error }) => (
                        <>
                            {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {PERMISSIONS.map(permission => (
                                    <td key={permission}>
                                        <label htmlFor={`${user.id}-permissions-${permission}`}>
                                            <input id={`${user.id}-permissions-${permission}`} type="checkbox" 
                                                checked={this.state.permissions.includes(permission)} 
                                                value={permission} onChange={this.handlePermissionChange} />
                                        </label>
                                    </td>
                                ))}
                                <td>
                                    <SickButton type="button" disabled={loading} onClick={updatePermissions}>Updat{loading ? 'ing': 'e'}</SickButton>
                                </td>
                            </tr>
                        </>
                    )
                }
            </Mutation>
        )
    }
}

export default Permission;