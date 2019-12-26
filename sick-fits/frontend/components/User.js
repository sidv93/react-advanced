import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropType from 'prop-types';

const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        me {
            id
            name
            email
            permissions
        }
    }
`;

const User = props => (
    <Query {...props} query={CURRENT_USER_QUERY}>
        { payload => props.children(payload) }
    </Query>
);

User.prototype = {
    children: PropType.func.isRequired
}
export default User;
export { CURRENT_USER_QUERY };