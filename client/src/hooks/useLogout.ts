import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/userService';

/**
 * Custom hook to handle log out of a user.
 *
 * @returns handleLogout - Function to handle the click of the logout button.
 */
const useLogout = () => {
  const navigate = useNavigate();

  /**
   * Handles a user logging out, which involves updating the current user state to null and
   * redirecting to the login page.
   * @param event The event object.
   */
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const res = await logoutUser();
      if (res === 'User successfully logged out') {
        navigate('/');
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return {
    handleLogout,
  };
};

export default useLogout;
