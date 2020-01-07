import PleaseSignIn from '../components/PleaseSignIn';
import Permission from '../components/Permissions';

const Permissions = props => (
    <div>
        <PleaseSignIn>
            <Permission />
        </PleaseSignIn>
    </div>
);

export default Permissions;