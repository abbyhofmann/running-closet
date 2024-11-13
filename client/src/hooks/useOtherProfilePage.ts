import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { User } from '../types';
import { followUser, getUserByUsername, unfollowUser } from '../services/userService';

const useOtherProfilePage = () => {
  const { user } = useUserContext();
  const { username } = useParams();
  const [following, setFollowing] = useState<User[]>([]);
  const [followedBy, setFollowedBy] = useState<User[]>([]);
  const [profileUser, setProfileUser] = useState<User>();
  const [currentUserFollowingThisUser, setCurrentUserFollowingThisUser] = useState<boolean>(false);
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
  }, [user.username, username, profileUser?.following, profileUser?.followers, navigate]);

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
