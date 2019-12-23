import UpdateItems from '../components/UpdateItems';

const Update = props => (
    <div>
        <UpdateItems id={props.query.id} />
    </div>
);

export default Update;