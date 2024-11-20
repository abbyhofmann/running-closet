import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import './index.css';
import useOtherProfilePage from '../../../../hooks/useOtherProfilePage';
import ProfileCard from './profileCard';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Represents the profile page of a user that is not the user logged in.
 * @returns the other user profile page component.
 */
const OtherUserProfilePage = () => {
  const {
    username,
    following,
    followedBy,
    currentUserFollowingThisUser,
    follow,
    unfollow,
    otherUserProfileGraphic,
  } = useOtherProfilePage();
  return (
    <Grid container rowSpacing={1} columnSpacing={1}>
      <Grid size={2}>
        <div style={{ marginTop: 45, marginLeft: 30 }}>
          <ProfileAvatar profileGraphic={otherUserProfileGraphic} size={150}></ProfileAvatar>
        </div>
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
          {following.map(u => (
            <div key={u.username}>
              <ProfileCard username={u.username} profileGraphic={u.profileGraphic}></ProfileCard>
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};
export default OtherUserProfilePage;
