import './index.css';
import { Alert } from '@mui/material';
import useRegister from '../../hooks/useRegister';

/**
 * Register Component contains a form that allows the user to input a username, password, and their email
 * to register them. If the user is registered, their username is then submitted to the application's
 * context through the useLoginContext hook. If there is an error, then an error is displayed.
 */
const Register = () => {
  const {
    username,
    pass,
    email,
    registrationError,
    showRegistrationError,
    handleSubmit,
    handleEmailChange,
    handleUsernameChange,
    handlePassChange,
  } = useRegister();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter registration details below.</h4>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label className='labels' htmlFor='username'>
            Username:
          </label>
          <input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter a username'
            required
            className='input-text'
            key='username'
            id={'usernameInput'}
          />
        </div>
        <div className='row'>
          <label className='labels' htmlFor='email'>
            Email:
          </label>
          <input
            type='text'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email'
            required
            className='input-text'
            key='email'
            id={'emailInput'}
          />
        </div>
        <div className='row'>
          <label className='labels' htmlFor='pass'>
            Password:
          </label>
          <input
            type='password'
            value={pass}
            onChange={handlePassChange}
            placeholder='Enter a password'
            required
            className='input-text'
            key='pass'
            id={'passInput'}
          />
        </div>
        {showRegistrationError && (
          <div className='alert-container'>
            <Alert severity='error' className='error-alert'>
              {registrationError}
            </Alert>
          </div>
        )}
        <button type='submit' className='login-button'>
          Register
        </button>
      </form>
      <h4>
        Already registered? <a href='/'>Login</a>
      </h4>
    </div>
  );
};

export default Register;
