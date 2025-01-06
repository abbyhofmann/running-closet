import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../../../profileAvatar';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Represents the props for the ProfileCard component.
 * - username the user that the card is for.
 */
interface ProfileCardProps {
  username: string;
  profileGraphic: number;
  firstName: string;
  lastName: string;
}

/**
 * Represents a profile card that navigates to that user's profile.
 * @returns the profile card element.
 */
const ProfileCard = (props: ProfileCardProps) => {
  const { username, profileGraphic, firstName, lastName } = props;
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <Card
      onClick={() => {
        navigate(`/profile/${username}`);
      }}
      key={username}>
      {/* The logged-in profile card will appear slightly darker in another user's list of followers/following */}
      <Box
        sx={{
          display: 'flex',
          backgroundColor: username === user.username ? grey[400] : grey[300],
          padding: 1,
        }}>
        <ProfileAvatar profileGraphic={profileGraphic} size={75}></ProfileAvatar>
        <Typography
          variant='h6'
          sx={{ textAlign: 'center', marginY: 'auto', color: '#32292F', paddingLeft: 2 }}
          noWrap>
          {firstName} {lastName} (@{username})
        </Typography>
      </Box>
    </Card>
  );
};
export default ProfileCard;

// const WorkoutCard = ({
//   workout,
//   onSelectWorkout,
// }: {
//   workout: Workout;
//   onSelectWorkout: (workout: Workout) => void;
// }) => (
//   <Card
//     sx={{ display: 'flex' }}
//     onClick={() => {
//       onSelectWorkout(workout);
//     }}>
//     <Box
//       sx={{
//         // minWidth: 300,
//         // maxWidth: 300,
//         // border: '1px solid #ccc',
//         // borderRadius: 2,
//         // padding: 2,
//         // margin: 1,
//         // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//         // bgcolor: '#fff',
//         display: 'flex',
//         backgroundColor: grey[400],
//         padding: 1,
//       }}>
//       <Typography variant='h6'>{workout.runType}</Typography>
//       <Typography variant='body2'>
//         Date: {new Date(workout.dateCompleted).toLocaleDateString()}
//       </Typography>
//       <Typography variant='body2'>Distance: {workout.distance} miles</Typography>
//       <Typography variant='body2'>Duration: {workout.duration} minutes</Typography>
//       <Typography variant='body2'>Location: {workout.location}</Typography>
//     </Box>
//   </Card>
// );
