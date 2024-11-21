import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Represents the props for the ProfileCard component.
 * - username the user that the card is for.
 */
interface ProfileCardProps {
  username: string;
  profileGraphic: number;
}

/**
 * Represents a profile card that navigates to that user's profile.
 * @returns the profile card element.
 */
const ProfileCard = (props: ProfileCardProps) => {
  const { username, profileGraphic } = props;
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(`/profile/${username}`);
      }}
      key={username}>
      <Box sx={{ display: 'flex', backgroundColor: grey[300], padding: 1 }}>
        <ProfileAvatar profileGraphic={profileGraphic} size={75}></ProfileAvatar>
        <Typography
          variant='h6'
          sx={{ textAlign: 'center', marginY: 'auto', color: '#32292F', paddingLeft: 2 }}
          noWrap>
          {username}
        </Typography>
      </Box>
    </Card>
  );
};
export default ProfileCard;
