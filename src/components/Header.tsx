import { AppBar, Toolbar, Link, styled, Typography } from '@mui/material';

import logo from '../assets/images/logos/xx-network-logo--white.svg';

const StyledContainer = styled(AppBar)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  background: theme.gradients?.primary,
}));

const Header = () => (
  <StyledContainer position='static'>
    <Toolbar sx={{ flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between'}}>
      <Link>
        <img src={logo} />
      </Link>
      <Typography variant='h4' sx={{fontWeight: 'bolder'}} >
        Sleeve . Wallet Generation
      </Typography>
    </Toolbar>
  </StyledContainer>
)

export default Header;
