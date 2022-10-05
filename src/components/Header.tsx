import { AppBar, Toolbar, Link, styled } from '@mui/material';

import logo from '../assets/images/logos/xx-network-logo--white.svg';

const StyledContainer = styled(AppBar)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  background: theme.gradients?.primary,
}));

const Header = () => (
  <StyledContainer position='static'>
    <Toolbar>
      <Link>
        <img src={logo} />
      </Link> 
    </Toolbar>
  </StyledContainer>
)

export default Header;
