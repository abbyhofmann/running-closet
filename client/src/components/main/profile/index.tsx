import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import OtherUserProfilePage from './otherUserProfile';
import { getUserByUsername } from '../../../services/userService';
import UserNotFoundPage from './userNotFound';
import LoggedInUserProfilePage from './loggedInUserProfile';
import { User } from '../../../types';
import useLoginContext from '../../../hooks/useLoginContext';

/**
 * Represents the profile page component. Routes to the right view based on the
 * logged in user and profile user relationship.
 * @returns the ProfilePage component.
 */
const ProfilePage = () => {
  const { username } = useParams();
  const { user, socket } = useUserContext();
  const { setUser } = useLoginContext();
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

    /**
     * Handles when users are followed or unfollowed..
     * @param user1 the user that followed/unfollowed the other.
     * @param user2 the user that was followed/unfollowed.
     */
    const handleFollowingUpdate = (user1: User, user2: User) => {
      if (user1.username === user.username) {
        setUser(user1);
        return;
      }
      if (user2.username === user.username) {
        setUser(user2);
      }
    };

    socket.on('followingUpdate', handleFollowingUpdate);

    return () => {
      socket.off('followingUpdate', handleFollowingUpdate);
    };
  }, [username, socket, user.username, setUser]);

  return (
    <div>
      {user.username === username && <LoggedInUserProfilePage></LoggedInUserProfilePage>}
      {user.username !== username && notFound && <UserNotFoundPage></UserNotFoundPage>}
      {user.username !== username && !notFound && <OtherUserProfilePage></OtherUserProfilePage>}
    </div>
  );
};
export default ProfilePage;
