import { useNavigate } from 'react-router-dom';
import { deleteUser, logoutUser } from '../services/userService';

const useDeleteProfile = (username: string) => {
  const navigate = useNavigate();

  const handleDeleteProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const deleteRes = await deleteUser(username);
      const logoutRes = await logoutUser();
      if (deleteRes && logoutRes === 'User successfully logged out') {
        navigate('/');
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return {
    handleDeleteProfile,
  };
};

export default useDeleteProfile;
