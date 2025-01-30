import './index.css';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  Input,
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
    gender,
    age,
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
    handleGenderSelect,
    handleAgeChange,
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
        <Box>
          <img
            src='/logos/stridestyle-logo.png'
            style={{
              height: '60px',
            }}
            alt='stridestyle logo'
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
              src={`/profileGraphics/image${num}.png`}
              alt={`Profile option ${num}`}
              className={`profile-photo ${profileGraphic === num ? 'selected' : ''}`}
              onClick={() => handleProfileGraphicSelect(num)}
            />
          ))}
        </div>
        <div className='row'>
          <TextField
            required
            id='standard-first-name-input'
            label='First Name'
            value={firstName}
            variant='standard'
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleFirstNameChange}
          />
          <TextField
            required
            id='standard-last-name-input'
            label='Last Name'
            value={lastName}
            variant='standard'
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleLastNameChange}
          />
        </div>
        <div className='row'>
          <FormControl fullWidth>
            <InputLabel id='gender-select-label'>Gender</InputLabel>
            <Select
              labelId='gender-select-label'
              variant='standard'
              id='gender-select'
              value={gender}
              label='Gender'
              onChange={e => handleGenderSelect(e.target.value)}>
              <MenuItem value={'male'}>Male</MenuItem>
              <MenuItem value={'female'}>Female</MenuItem>
              <MenuItem value={'other'}>Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id='age-input'
            variant='standard'
            label='Age'
            type='text'
            required
            autoComplete='current-age'
            value={age}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={e => {
              const { value } = e.target;
              // Allow only integers greater than or equal to 0
              if (value === '' || /^[0-9]+$/.test(value)) {
                handleAgeChange(Number(value));
              }
            }}
          />
        </div>
        <div className='row'>
          <TextField
            id='outlined-username-input'
            variant='standard'
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
            variant='standard'
            label='Email'
            required
            value={email}
            sx={{ marginX: 'auto', width: '25ch' }}
            onChange={handleEmailChange}
          />
        </div>
        <div className='row'>
          <FormControl sx={{ width: '25ch', marginX: 'auto' }} variant='standard'>
            <InputLabel htmlFor='standard-adornment-password'>Password *</InputLabel>
            <Input
              id='standard-adornment-password'
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
