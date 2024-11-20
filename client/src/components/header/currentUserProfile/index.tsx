import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useUserContext from '../../../hooks/useUserContext';
import ProfileAvatar from '../../profileAvatar';

export default function CurrentUserProfile() {
  const navigate = useNavigate();
  const { user } = useUserContext();

  // redirect to the user's profile page
  const handleCurrentUserProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <IconButton onClick={handleCurrentUserProfileClick} aria-label='current user profile'>
      <ProfileAvatar profileGraphic={user.profileGraphic} size={40}></ProfileAvatar>
    </IconButton>
  );
}
