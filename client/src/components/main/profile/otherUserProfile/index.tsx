import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
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
      <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
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
            sx={{ bgcolor: '#E77963', marginY: 2, marginLeft: 2, color: '#EDE6E3' }}
            onClick={unfollow}>
            Unfollow
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{ bgcolor: '#5171A5', marginY: 2, marginLeft: 2, color: '#EDE6E3' }}
            onClick={follow}>
            Follow
          </Button>
        )}
      </Grid>
      <Grid size={6} sx={{ paddingTop: 4, paddingBottom: 5, paddingLeft: 4 }}>
        <TableContainer sx={{ height: 425 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell
                  key={'followers'}
                  sx={{ backgroundColor: '#5171A5', color: '#EDE6E3', borderRadius: '16px' }}>
                  <Typography variant='h6' sx={{ paddingX: 'auto' }}>
                    <strong>Followers: {followedBy.filter(u => !u.deleted).length}</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {followedBy
                .filter(u => !u.deleted)
                .map(u => (
                  <TableRow tabIndex={-1} key={u.username}>
                    <TableCell>
                      <ProfileCard
                        username={u.username}
                        profileGraphic={u.profileGraphic}></ProfileCard>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid size={6} sx={{ paddingTop: 4, paddingBottom: 5, paddingRight: 4 }}>
        <TableContainer sx={{ height: 425 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell
                  key={'following'}
                  sx={{ backgroundColor: '#5171A5', color: '#EDE6E3', borderRadius: '16px' }}>
                  <Typography variant='h6'>
                    <strong>Following: {following.filter(u => !u.deleted).length}</strong>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {following
                .filter(u => !u.deleted)
                .map(u => (
                  <TableRow tabIndex={-1} key={u.username}>
                    <TableCell>
                      <ProfileCard
                        username={u.username}
                        profileGraphic={u.profileGraphic}></ProfileCard>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
export default OtherUserProfilePage;
