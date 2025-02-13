import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import useLogout from '../../../hooks/useLogout';

/**
 * Logout button component.
 */
export default function LogoutButton() {
  const { handleLogout } = useLogout();
  return (
    <div>
      <Button
        id='logout-button'
        variant='contained'
        sx={{ bgcolor: '#5171A5', color: '#EDE6E3' }}
        startIcon={<LogoutIcon />}
        onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
