import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItems from './DeleteItems';
import AddToCart from './AddToCart';

class Item extends Component {
    static propTypes =  {
        item: PropTypes.object.isRequired
    }
    render() {
        const { item } = this.props;
        return (
            <ItemStyles>
                {item.image && <img src={item.image} alt={item.title} />}
                <Title>
                    <Link href={{
                        pathname: '/item',
                        query: {
                            id: item.id
                        }
                    }}>
                        <a>{item.name}</a>
                    </Link>
                </Title>
                <PriceTag>{formatMoney(item.price)}</PriceTag>
                <p>{item.description}</p>
                <div className="buttonList">
                    <Link href={{
                        pathname: 'update',
                        query: {
                            id: item.id
                        }
                    }}>
                        <a>Edit ✏  </a>
                    </Link>
                    <AddToCart id={item.id}/>
                    <DeleteItems id={item.id}>Delete</DeleteItems>
                </div>
            </ItemStyles>
        );
    }
}

Item.propTypes = {

};

export default Item;