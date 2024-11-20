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
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profileGraphic, setProfileGraphic] = useState<number>(-1);
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
   * Function to handle the first name input change event.
   *
   * @param e - the event object.
   */
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  /**
   * Function to handle the last name input change event.
   *
   * @param e - the event object.
   */
  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
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
   * Function to handle the profile graphic change event.
   *
   * @param num - the number associated with the photo selected.
   */
  const handleProfileGraphicSelect = (num: number) => {
    setProfileGraphic(num);
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
      const u = await registerUser(username, firstName, lastName, email, pass, profileGraphic);
      setUser(u);
      navigate('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage === 'Request failed with status code 400') {
        setRegistrationError('Registration failed with provided credentials. Please try again.');
      } else {
        setRegistrationError('There was an issue registering. Please try again.');
      }
      setShowRegistrationError(true);
    }
  };

  return {
    username,
    firstName,
    lastName,
    pass,
    email,
    profileGraphic,
    registrationError,
    showRegistrationError,
    handleEmailChange,
    handleUsernameChange,
    handlePassChange,
    handleSubmit,
    handleFirstNameChange,
    handleLastNameChange,
    handleProfileGraphicSelect,
  };
};

export default useRegister;
