import { Card, Typography } from '@mui/material';
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
      sx={{
        marginX: 2,
        minWidth: 150,
        height: 150,
        marginY: 2,
      }}
      key={username}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20px', // this may need to change but I couldn't figure out how to dynamically get it centered on the card
        }}>
        <ProfileAvatar profileGraphic={profileGraphic} size={75}></ProfileAvatar>
      </div>
      <Typography variant='h5' sx={{ textAlign: 'center' }} noWrap>
        {username}
      </Typography>
    </Card>
  );
};
export default ProfileCard;
