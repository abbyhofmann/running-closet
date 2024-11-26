import './index.css';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useRegister from '../../hooks/useRegister';

/**
 * Register Component contains a form that allows the user to input a username, password, and their email
 * to register them. If the user is registered, their username is then submitted to the application's
 * context through the useLoginContext hook. If there is an error, then an error is displayed.
 */
const Register = () => {
  const {
    username,
    firstName,
    lastName,
    pass,
    email,
    profileGraphic,
    registrationError,
    showRegistrationError,
    handleSubmit,
    handleEmailChange,
    handleUsernameChange,
    handlePassChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleProfileGraphicSelect,
    handleClickShowPassword,
    showPassword,
  } = useRegister();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <Box
        sx={{
          textAlign: 'center',
          marginBottom: 1,
          marginX: 'auto',
          color: '#32292F',
          display: 'flex',
        }}>
        <Box
          sx={{
            marginTop: 0.5,
            paddingRight: 3,
          }}>
          <img
            src='/logos/blue-logo.png'
            style={{
              height: '50px',
            }}
            alt='code connect logo'
            loading='lazy'
          />
        </Box>
        <Box>
          <img
            src='/logos/blue-name.png'
            style={{
              height: '50px',
            }}
            alt='code connect logo'
            loading='lazy'
          />
        </Box>
      </Box>
      <h4>Please enter registration details below.</h4>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label className='profileLabel' htmlFor='profileGraphic'>
            Select Profile Photo:
          </label>
        </div>
        <div className='profile-photo-grid'>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <img
              key={num}
              src={`/profileGraphics/image${num}.jpeg`}
              alt={`Profile option ${num}`}
              className={`profile-photo ${profileGraphic === num ? 'selected' : ''}`}
              onClick={() => handleProfileGraphicSelect(num)}
            />
          ))}
        </div>
        <div className='row'>
          <TextField
            id='outlined-first-name-input'
            label='First Name'
            required
            value={firstName}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleFirstNameChange}
          />
        </div>
        <div className='row'>
          <TextField
            id='outlined-lastname-input'
            label='Last Name'
            required
            value={lastName}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleLastNameChange}
          />
        </div>
        <div className='row'>
          <TextField
            id='outlined-username-input'
            label='Username'
            type='username'
            required
            autoComplete='current-username'
            value={username}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleUsernameChange}
          />
        </div>
        <div className='row'>
          <TextField
            id='outlined-email-input'
            label='Email'
            required
            value={email}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleEmailChange}
          />
        </div>
        <div className='row'>
          <FormControl sx={{ m: 1, width: '25ch', marginX: 'auto' }} variant='outlined'>
            <InputLabel htmlFor='outlined-adornment-password'>Password *</InputLabel>
            <OutlinedInput
              id='outlined-adornment-password'
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    edge='end'>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
              value={pass}
              onChange={handlePassChange}
            />
          </FormControl>
        </div>
        {showRegistrationError && (
          <div className='alert-container'>
            <Alert severity='error' className='error-alert'>
              {registrationError}
            </Alert>
          </div>
        )}
        <Button variant='contained' type='submit' sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
          Register
        </Button>
      </form>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{ mt: 2, flexWrap: 'nowrap' }}>
        <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
          Already registered?
        </Typography>
        <Button
          variant='text'
          sx={{
            ml: 1,
            fontWeight: 'bold',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            color: '#5171A5',
          }}
          onClick={() => {
            navigate('/');
          }}>
          Sign In Here!
        </Button>
      </Box>
    </div>
  );
};

export default Register;
