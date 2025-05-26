import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import NotificationDropdown from './notificationDropdown';
import './index.css';
import LogoutButton from './logoutButton';
import CurrentUserProfile from './currentUserProfile';
import NavigationMenu from './navigationMenu';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();
  const navigate = useNavigate();

  return (
    <Grid container sx={{ bgcolor: '#', height: 75 }}>
      <Grid size={1}>
        <Box
          sx={{
            justifyContent: 'flex-start',
            display: 'flex',
            alignItems: 'start',
            marginY: 2,
            paddingLeft: 1,
          }}>
          <NavigationMenu></NavigationMenu>
        </Box>
      </Grid>
      <Grid
        size={{ xs: 1, md: 4, lg: 9 }}
        container
        sx={{
          textAlign: 'center',
          marginTop: 1,
          marginX: 'auto',
          color: '#32292F',
        }}>
        <Grid
          size={{ xs: 0, md: 0, xl: 8 }}
          sx={{ display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' } }}>
          <Box
            sx={{
              justifyContent: 'flex-start',
              display: 'flex',
              alignItems: 'start',
            }}
            onClick={() => {
              navigate(`/home`);
            }}>
            <img
              src='/logos/stridestyle-logo.png'
              style={{
                height: '55px',
              }}
              alt='stridesytle logo'
              loading='lazy'
            />
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 10, md: 7, lg: 2 }}>
        <Box
          sx={{
            justifyContent: 'flex-end',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            marginTop: 1,
            paddingRight: 2,
          }}>
          <CurrentUserProfile />
          <Box
            component='form'
            sx={{ '& > :not(style)': { m: 'auto', width: '20ch' } }}
            autoComplete='off'>
            <TextField
              id='searchBar'
              placeholder='Search ...'
              value={val}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              sx={{ color: '#32292F', border: '#32292F' }}
              variant='outlined'
            />
          </Box>
          <NotificationDropdown />
          <LogoutButton />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Header;
