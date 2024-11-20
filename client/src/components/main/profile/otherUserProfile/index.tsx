import { Avatar, Button, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import './index.css';
import useOtherProfilePage from '../../../../hooks/useOtherProfilePage';
import ProfileCard from './profileCard';

/**
 * Represents the profile page of a user that is not the user logged in.
 * @returns the other user profile page component.
 */
const OtherUserProfilePage = () => {
  const { username, following, followedBy, currentUserFollowingThisUser, follow, unfollow } =
    useOtherProfilePage();
  return (
    <Grid container rowSpacing={1} columnSpacing={1}>
      <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
        <Avatar sx={{ bgcolor: blue[700], width: 150, height: 150, marginTop: 5, marginLeft: 4 }}>
          {<Typography variant='h1'>{username?.charAt(0).toUpperCase()}</Typography>}
        </Avatar>
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 8, lg: 10 }}>
        <Typography sx={{ marginTop: 8, marginLeft: 2 }} variant='h4'>
          {username}
        </Typography>
        {currentUserFollowingThisUser ? (
          <Button
            variant='contained'
            sx={{ bgcolor: 'red', marginY: 2, marginLeft: 2 }}
            onClick={unfollow}>
            Unfollow
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{ bgcolor: 'green', marginY: 2, marginLeft: 2 }}
            onClick={follow}>
            Follow
          </Button>
        )}
      </Grid>
      <Grid size={{ xs: 4, sm: 4, md: 2, lg: 2 }} sx={{ marginTop: 5 }}>
        <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5 }}>
          Followed By:
        </Typography>
      </Grid>
      <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }} sx={{ marginTop: 5 }}>
        <div className='following-box'>
          {followedBy.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username}></ProfileCard>
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
          {following.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};
export default OtherUserProfilePage;
