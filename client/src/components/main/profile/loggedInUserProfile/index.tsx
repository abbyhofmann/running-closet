import { Avatar, Typography, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import './index.css';
import useDeleteProfile from '../../../../hooks/useDeleteProfile';
import useUserContext from '../../../../hooks/useUserContext';
import ProfileCard from '../otherUserProfile/profileCard';

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
        <Avatar sx={{ bgcolor: blue[700], width: 150, height: 150, marginTop: 5, marginLeft: 4 }}>
          {<Typography variant='h1'>{user.username?.charAt(0).toUpperCase()}</Typography>}
        </Avatar>
      </Grid>
      <Grid size={10}>
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
      <Grid size={2} sx={{ marginTop: 5 }}>
        <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5 }}>
          Followers:
        </Typography>
      </Grid>
      <Grid size={10} sx={{ marginTop: 5 }}>
        <div className='following-box'>
          {user.followers.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
      <Grid size={2} sx={{ marginTop: 2 }}>
        <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5 }}>
          Following:
        </Typography>
      </Grid>
      <Grid size={10} sx={{ marginY: 2 }}>
        <div className='following-box'>
          {user.following.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};
export default LoggedInUserProfilePage;
