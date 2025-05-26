import {
  Avatar,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

/**
 * Represents the profile page of a user that has been deleted, and therefore, no longer exists.
 * @returns the user not found page component.
 */
const UserNotFoundPage = () => (
  <Grid container rowSpacing={1} columnSpacing={1}>
    <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
      <Avatar
        sx={{
          bgcolor: '#32292F',
          color: '#f5f3f5',
          width: 150,
          height: 150,
          marginTop: 5,
          marginLeft: 4,
        }}>
        {<Typography variant='h1'>U</Typography>}
      </Avatar>
    </Grid>
    <Grid size={{ xs: 6, sm: 6, md: 8, lg: 10 }}>
      <Typography sx={{ marginTop: 10, color: '32292F' }} variant='h4'>
        User Not Found
      </Typography>
    </Grid>
    <Grid size={6} sx={{ paddingTop: 4, paddingBottom: 5, paddingLeft: 4 }}>
      <TableContainer sx={{ height: 400 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                key={'followers'}
                sx={{ backgroundColor: '#32292F', color: '#f5f3f5', borderRadius: '16px' }}>
                <Typography variant='h5' sx={{ paddingX: 'auto' }}>
                  Followers: 0
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Grid>
    <Grid size={6} sx={{ paddingTop: 4, paddingBottom: 5, paddingRight: 4 }}>
      <TableContainer sx={{ height: 400 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                key={'following'}
                sx={{ backgroundColor: '#32292F', color: '#f5f3f5', borderRadius: '16px' }}>
                <Typography variant='h5'>Following: 0</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
);
export default UserNotFoundPage;
