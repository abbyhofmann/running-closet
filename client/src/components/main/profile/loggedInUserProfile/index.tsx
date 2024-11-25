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
      <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
        <div style={{ marginTop: 45, marginLeft: 30 }}>
          <ProfileAvatar profileGraphic={user.profileGraphic} size={150}></ProfileAvatar>
        </div>
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 8, lg: 10 }}>
        <Typography sx={{ marginTop: 8, marginLeft: 2, color: '#32292F' }} variant='h4'>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography sx={{ marginTop: 1, marginLeft: 2, color: '#32292F' }} variant='h5'>
          @{user.username}
        </Typography>
        <Button
          id='delete-profile-button'
          variant='contained'
          sx={{ bgcolor: '#E77963', marginY: 2, marginLeft: 2 }}
          onClick={handleDeleteProfile}>
          Delete Profile
        </Button>
      </Grid>
      <Grid size={6} sx={{ paddingTop: 4, paddingBottom: 5, paddingLeft: 4 }}>
        <TableContainer sx={{ height: 425 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell
                  key={'followers'}
                  sx={{ backgroundColor: '#5171A5', color: '#EDE6E3', borderRadius: '16px' }}>
                  <Typography variant='h6'>Followers: {user.followers.length}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.followers.map(u => (
                <TableRow tabIndex={-1} key={u.username}>
                  <TableCell>
                    <ProfileCard
                      username={u.username}
                      profileGraphic={u.profileGraphic}
                      firstName={u.firstName}
                      lastName={u.lastName}></ProfileCard>
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
                  <Typography variant='h6'>Following: {user.following.length}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.following.map(u => (
                <TableRow tabIndex={-1} key={u.username}>
                  <TableCell>
                    <ProfileCard
                      username={u.username}
                      profileGraphic={u.profileGraphic}
                      firstName={u.firstName}
                      lastName={u.lastName}></ProfileCard>
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
export default LoggedInUserProfilePage;
