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
        sx={{ bgcolor: '#473BF0', color: '#f5f3f5' }}
        startIcon={<LogoutIcon />}
        onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
