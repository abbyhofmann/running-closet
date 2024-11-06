import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { registerUser } from '../services/userService';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns pass - The current value of the password input.
 * @returns email - The current value of the email input.
 * @returns handleUsernameChange - Function to handle changes in the username field.
 * @returns handlePasswordChange - Function to handle changes in the password field.
 * @returns handleEmailChange - Function to handle changes in the email field.
 * @returns handleSubmit - Function to handle login submission
 * @returns registrationError - The current value of the registration error.
 * @returns showRegistrationError - The current value of the showRegistrationError boolean value.
 */
const useRegister = () => {
  const [username, setUsername] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [registrationError, setRegistrationError] = useState<string>('');
  const [showRegistrationError, setShowRegistrationError] = useState<boolean>(false);

  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the username input change event.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the password input change event.
   *
   * @param e - the event object.
   */
  const handlePassChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPass(e.target.value);
  };

  /**
   * Function to handle the email input change event.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setRegistrationError('');
      setShowRegistrationError(false);
      const u = await registerUser(username, email, pass);
      setUser(u);
      navigate('/home');
    } catch (err) {
      setRegistrationError((err as Error).message);
      setShowRegistrationError(true);
    }
  };

  return {
    username,
    pass,
    email,
    registrationError,
    showRegistrationError,
    handleEmailChange,
    handleUsernameChange,
    handlePassChange,
    handleSubmit,
  };
};

export default useRegister;
