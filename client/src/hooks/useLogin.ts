import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { loginUser } from '../services/userService';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event for username.
   * @param e - the event object
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);

  /**
   * Function to handle the input change event for password.
   * @param e - the event object
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  /**
   * Function to handle the visibility of the password.
   */
  const handleClickShowPassword = () => setShowPassword(show => !show);

  /**
   * Function to handle the submission of the login form.
   * If the login is successful, the user is redirected to the home page. If the login fails, an alert is shown.
   * @param e - the event object
   */
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === '' || password === '') {
      return;
    }

    try {
      const res = await loginUser(username, password);

      if (res) {
        setUser(res);
        setAlert(null);
        navigate('/home');
      } else {
        setAlert('There was an issue signing in. Please try again.');
        setUsername('');
        setPassword('');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage === 'Request failed with status code 401') {
        setAlert('Username/password not found. Please try again.');
      } else {
        setAlert('There was an issue signing in. Please try again.');
      }

      setUsername('');
      setPassword('');
    }
  };

  /**
   * Function to handle the sign up button click and reroute the user to the register new user page.
   * @param e - the event object
   */
  const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    // TODO - Implement sign up logic here (should just be a redirect to the sign up page) but not possible until that UI is created
  };

  return {
    username,
    password,
    alert,
    showPassword,
    handleUsernameChange,
    handlePasswordChange,
    handleClickShowPassword,
    handleSignIn,
    handleSignUp,
  };
};

export default useLogin;
