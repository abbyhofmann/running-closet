import { Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './index.css';
import useDeleteProfile from '../../../../hooks/useDeleteProfile';
import useUserContext from '../../../../hooks/useUserContext';
import ProfileCard from '../otherUserProfile/profileCard';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Represents the profile page of the logged in user.
 * @returns The logged in user profile page component.
 */
const LoggedInUserProfilePage = () => {
  const { user } = useUserContext();
  const { handleDeleteProfile } = useDeleteProfile(user.username);

  return (
    <Grid container rowSpacing={1} columnSpacing={1}>
      <Grid size={2}>
        <div style={{ marginTop: 45, marginLeft: 30 }}>
          <ProfileAvatar profileGraphic={user.profileGraphic} size={150}></ProfileAvatar>
        </div>
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 8, lg: 10 }}>
        <Typography sx={{ marginTop: 8, marginLeft: 2 }} variant='h4'>
          {user.username}
        </Typography>
        <Typography sx={{ marginLeft: 2 }} variant='h6'>
          {user.email}
        </Typography>
        <Button
          id='delete-profile-button'
          variant='contained'
          sx={{ bgcolor: 'red', marginY: 2, marginLeft: 2 }}
          onClick={handleDeleteProfile}>
          Delete Profile
        </Button>
      </Grid>
      <Grid size={{ xs: 4, sm: 4, md: 2, lg: 2 }} sx={{ marginTop: 5 }}>
        <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5 }}>
          Followers:
        </Typography>
      </Grid>
      <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }} sx={{ marginTop: 5 }}>
        <div className='following-box'>
          {user.followers.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username} profileGraphic={u.profileGraphic}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
      <Grid size={{ xs: 4, sm: 4, md: 2, lg: 2 }} sx={{ marginTop: 2 }}>
        <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5 }}>
          Following:
        </Typography>
      </Grid>
      <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }} sx={{ marginY: 2 }}>
        <div className='following-box'>
          {user.following.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username} profileGraphic={u.profileGraphic}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};
export default LoggedInUserProfilePage;
