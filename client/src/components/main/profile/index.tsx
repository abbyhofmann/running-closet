import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import OtherUserProfilePage from './otherUserProfile';
import { getUserByUsername } from '../../../services/userService';
import UserNotFoundPage from './userNotFound';

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useUserContext();
  const [notFound, setNotFound] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          await getUserByUsername(username);
          setNotFound(false);
        } catch (err) {
          setNotFound(true);
        }
      }
    };
    fetchData();
  }, [username]);

  return (
    <div>
      {user.username === username && <div>Current User Profile</div>}
      {user.username !== username && notFound && <UserNotFoundPage></UserNotFoundPage>}
      {user.username !== username && !notFound && <OtherUserProfilePage></OtherUserProfilePage>}
    </div>
  );
};
export default ProfilePage;
