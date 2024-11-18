import { IconButton, Avatar } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom';
import useUserContext from '../../../hooks/useUserContext';

export default function CurrentUserProfile() {
  const navigate = useNavigate();
  const { user } = useUserContext();

  // redirect to the user's profile page
  const handleCurrentUserProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <IconButton onClick={handleCurrentUserProfileClick} aria-label='current user profile'>
      <Avatar>
        <AccountBoxIcon />
      </Avatar>
    </IconButton>
  );
}
