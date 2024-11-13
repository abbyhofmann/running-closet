import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid2';
import { grey } from '@mui/material/colors';
import useHeader from '../../hooks/useHeader';
import NotificationDropdown from './notificationDropdown';
import './index.css';
import LogoutButton from './logoutButton';
/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown } = useHeader();

  return (
    <Grid container sx={{ bgcolor: grey[300], height: 75 }}>
      <Grid size={10}>
        <Typography variant='h4' sx={{ textAlign: 'center', marginTop: 2 }}>
          <strong>Fake Stack Overflow</strong>
        </Typography>
      </Grid>
      <Grid size={2}>
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', marginTop: 2 }}>
          <input
            id='searchBar'
            placeholder='Search ...'
            type='text'
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <NotificationDropdown />
          <LogoutButton />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Header;
