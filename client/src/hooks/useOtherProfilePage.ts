import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { User } from '../types';
import { followUser, getUserByUsername, unfollowUser } from '../services/userService';

const useOtherProfilePage = () => {
  const { user, socket } = useUserContext();
  const { username } = useParams();
  const [following, setFollowing] = useState<User[]>([]);
  const [followedBy, setFollowedBy] = useState<User[]>([]);
  const [profileUser, setProfileUser] = useState<User>();
  const [currentUserFollowingThisUser, setCurrentUserFollowingThisUser] = useState<boolean>(false);
  // state variable for when following/follower lists get updated to prevent over-rendering
  const [followListsUpdated, setFollowListsUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        try {
          const profUser: User = await getUserByUsername(username);
          setCurrentUserFollowingThisUser(
            profUser.followers.map(u => u.username).includes(user.username),
          );
          setFollowing(profUser.following);
          setFollowedBy(profUser.followers);
          setProfileUser(profUser);
        } catch (err) {
          navigate(`/profile/${username}`);
        }
      }
    };
    fetchData();
    setFollowListsUpdated(false);
  }, [user.username, username, followListsUpdated, navigate]);

  useEffect(() => {
    /**
     * Handles when users are followed or unfollowed..
     * @param user1 the user that followed/unfollowed the other.
     * @param user2 the user that was followed/unfollowed.
     */
    const handleFollowingUpdate = (user1: User, user2: User) => {
      if (user1.username === username) {
        const followingList: User[] = user1.following;
        setFollowing(followingList);
      } else if (user2.username === username) {
        const followersList: User[] = user2.followers;
        setFollowedBy(followersList);
      }
      setFollowListsUpdated(true);
    };
    socket.on('followingUpdate', handleFollowingUpdate);
    return () => {
      socket.off('followingUpdate', handleFollowingUpdate);
    };
  }, [socket, username]);

  /**
   * Makes the current user follow the profile user.
   */
  const follow = async () => {
    if (!user._id || !profileUser?._id) {
      setCurrentUserFollowingThisUser(false);
      return;
    }
    try {
      const profUser = await followUser(user._id, profileUser?._id);
      setProfileUser(profUser);
      setCurrentUserFollowingThisUser(true);
      setFollowListsUpdated(true);
    } catch (err) {
      setCurrentUserFollowingThisUser(false);
    }
  };

  /**
   * Makes the current user unfollow the profile user.
   */
  const unfollow = async () => {
    if (!user._id || !profileUser?._id) {
      setCurrentUserFollowingThisUser(false);
      return;
    }
    try {
      const profUser = await unfollowUser(user._id, profileUser?._id);
      setProfileUser(profUser);
      setCurrentUserFollowingThisUser(false);
      setFollowListsUpdated(true);
    } catch (err) {
      setCurrentUserFollowingThisUser(true);
    }
  };
  return {
    user,
    username,
    following,
    setFollowing,
    followedBy,
    setFollowedBy,
    profileUser,
    setProfileUser,
    currentUserFollowingThisUser,
    setCurrentUserFollowingThisUser,
    follow,
    unfollow,
  };
};
export default useOtherProfilePage;
