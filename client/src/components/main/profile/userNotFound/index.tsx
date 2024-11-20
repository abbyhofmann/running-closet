import { Avatar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/system';

/**
 * Represents the profile page of a user that has been deleted, and therefore, no longer exists.
 * @returns the user not found page component.
 */
const UserNotFoundPage = () => (
  <Grid container rowSpacing={1} columnSpacing={1}>
    <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }}>
      <Avatar sx={{ bgcolor: grey[500], width: 150, height: 150, marginTop: 5, marginLeft: 4 }}>
        {<Typography variant='h1'>U</Typography>}
      </Avatar>
    </Grid>
    <Grid size={{ xs: 6, sm: 6, md: 8, lg: 10 }}>
      <Typography sx={{ marginTop: 10, color: grey[700] }} variant='h4'>
        User Not Found
      </Typography>
    </Grid>
    <Grid size={{ xs: 4, sm: 4, md: 2, lg: 2 }} sx={{ marginTop: 2 }}>
      <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5, color: grey[700] }}>
        Followed By:
      </Typography>
    </Grid>
    <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }} sx={{ marginTop: 5, bgcolor: grey[200] }}>
      <Box sx={{ height: 150 }}></Box>
    </Grid>
    <Grid size={{ xs: 4, sm: 4, md: 2, lg: 2 }} sx={{ marginTop: 2 }}>
      <Typography variant='h6' sx={{ marginTop: 8, marginLeft: 5, color: grey[700] }}>
        Following:
      </Typography>
    </Grid>
    <Grid size={{ xs: 8, sm: 8, md: 10, lg: 10 }} sx={{ marginTop: 5, bgcolor: grey[200] }}>
      <Box sx={{ height: 150 }}></Box>
    </Grid>
  </Grid>
);
export default UserNotFoundPage;
