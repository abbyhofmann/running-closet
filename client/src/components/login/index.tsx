import React from 'react';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const {
    username,
    password,
    alert,
    showPassword,
    handleUsernameChange,
    handlePasswordChange,
    handleClickShowPassword,
    handleSignIn,
    handleSignUp,
  } = useLogin();

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
      <Box
        component='form'
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete='off'
        onSubmit={handleSignIn}>
        <div>
          <TextField
            id='outlined-username-input'
            label='Username'
            type='username'
            autoComplete='current-username'
            value={username}
            onChange={handleUsernameChange}
          />
          <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
            <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
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
              value={password}
              onChange={handlePasswordChange}
            />
          </FormControl>

          <Button
            variant='contained'
            type='submit'
            sx={{ mt: 2, width: '25ch', bgcolor: '#5171A5' }}>
            Sign In
          </Button>
        </div>
      </Box>

      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{ mt: 2, flexWrap: 'nowrap' }}>
        <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
          Need an Account?
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
          onClick={handleSignUp}>
          Sign Up Here!
        </Button>
      </Box>

      {alert && <Alert severity='error'>{alert}</Alert>}
    </div>
  );
};

export default Login;
