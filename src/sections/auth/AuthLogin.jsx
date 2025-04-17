import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { authService } from '../../api/auth';
import { login } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { auth } from '../../utils/auth';

const passwordSchema = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters'
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must contain at least one uppercase, one lowercase, one number and one special character'
  }
};
// Mock user credentials
const userCredentials = [
  { title: 'Admin', Username: 'admin', Password: 'Admin@123' },
  { title: 'User', Username: 'yassein47', Password: 'Yassein@123' }
];



export default function AuthLogin({ inputSx }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: { Username: 'admin', Password: 'Admin@123' } });

 



  // Handle form submission
  const onSubmit = async (formData) => {
    setIsProcessing(true);
    setLoginError('');

    
    try {
      const res = await authService.login({
        ...formData
      });
      if(res === "Invalid credentials"){
        return;
      }
      else{
        auth.setToken(res.token, 3600);
        dispatch(login({
          user: {
            id: res.user.id,
            username: res.user.username,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            role: res.user.role 
          },
          token: res.token,
          role: res.user.role 
        }));        
        navigate(res.user.role === 'Admin' ? '/admin/dashboard' : '/user/dashboard');
      } 
    } catch (error) {
      setLoginError('Error with login');
    } finally {
      setIsProcessing(false);
    }
  };

  const commonIconProps = { size: 16, color: theme.palette.grey[700] };

  return (
    <>
    <Stack 
      direction="row" 
      spacing={2} 
      justifyContent="center" 
      sx={{ mb: 3 }}
    >
      <Button 
        variant="outlined" 
        onClick={() => {
          reset({ Username: userCredentials[0].Username, Password: userCredentials[0].Password });
        }}
        sx={{ px: 4 }}
      >
        Login as Admin
      </Button>
      <Button 
        variant="contained" 
        onClick={() => {
          reset({ Username: userCredentials[1].Username, Password: userCredentials[1].Password });
        }}
        sx={{ px: 4 }}
      >
        Login as User
      </Button>
    </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Box>
            <InputLabel>Username</InputLabel>
            <OutlinedInput
            {...register('Username')}
              placeholder="username..."
              fullWidth
              sx={inputSx}
            />
          </Box>

          <Box>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              {...register('Password', passwordSchema)}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              fullWidth
              error={Boolean(errors.Password)}
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
                </InputAdornment>
              }
              sx={inputSx}
            />
            <Stack direction="row" alignItems="center" justifyContent={errors.password ? 'space-between' : 'flex-end'} width={1}>
              {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                variant="caption"
                textAlign="right"
                sx={{ '&:hover': { color: 'primary.dark' }, mt: 0.75 }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isProcessing}
          endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
          sx={{ minWidth: 120, mt: { xs: 1, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
        >
          Sign In
        </Button>

        {loginError && (
          <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
            {loginError}
          </Alert>
        )}
      </form>
    </>
  );
}

AuthLogin.propTypes = { inputSx: PropTypes.any };