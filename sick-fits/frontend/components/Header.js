import Nav from './Nav';
import Link from 'next/link';
import styled from 'styled-components';
import Router from 'next/router';
import NProgress from 'nprogress';
import Cart from './Cart';
import Search from './Search';

Router.onRouteChangeStart = () => {
    NProgress.start();
}

Router.onRouteChangeComplete = () => {
    NProgress.done();
}

Router.onRouteChangeStart = () => {
    NProgress.done();
}

const Logo = styled.h1`
    font-size: 4rem;
    margin-left: 2rem;
    position: relative;
    transform: skew(-7deg);
    z-index: 2;
    a {
        background: ${props => props.theme.red};
        text-transform: uppercase;
        text-decoration: none;
        padding: 0.5rem 1rem;
        color: white;

    }
    @media (max-width: 1300px) {
        margin: 0;
        text-align: center;
    }
`;

const StyledHeader = styled.header`
    .bar {
        border-bottom: 10px solid ${props => props.theme.black};
        display: grid;
        grid-template-columns: auto 1fr;
        justify-content: space-between;
        align-items: stretch;
        @media (max-width: 1300px) {
            grid-template-columns: 1fr;
            justify-content: center;
        }
    }
    .sub-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        border-bottom: 1px solid ${props => props.theme.lightgrey};
    }
`

const Header = () => (
    <StyledHeader>
        <div className="bar">
            <Logo>
                <Link href="/">
                    <a>Sick Fits!</a>
                </Link>
            </Logo>
            <Nav />
        </div>
        <div className="sub-bar">
            <Search />
        </div>
        <Cart />
    </StyledHeader>
);

export default Header;