import { Avatar, Card, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

/**
 * Represents the props for the ProfileCard component.
 * - username the user that the card is for.
 */
interface ProfileCardProps {
  username: string;
}

/**
 * Represents a profile card that navigates to that user's profile.
 * @returns the profile card element.
 */
const ProfileCard = (props: ProfileCardProps) => {
  const { username } = props;
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/profile/${username}`);
      }}
      sx={{
        marginX: 2,
        minWidth: 150,
        height: 150,
        marginY: 2,
      }}
      key={username}>
      <Avatar
        sx={{
          marginX: 'auto',
          marginY: 2,
          bgcolor: blue[500],
          width: 75,
          height: 75,
        }}>
        {<Typography variant='h3'>{username?.charAt(0).toUpperCase()}</Typography>}
      </Avatar>
      <Typography variant='h5' sx={{ textAlign: 'center' }} noWrap>
        {username}
      </Typography>
    </Card>
  );
};
export default ProfileCard;
