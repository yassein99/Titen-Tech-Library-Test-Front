import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useForm } from 'react-hook-form';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { firstNameSchema, lastNameSchema, passwordSchema } from '../../utils/validationSchema';

import { authService } from '../../api/auth';

export default function AuthRegister({ inputSx }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: { dialcode: '+1' } });

  const PasswordHash = useRef({});
  PasswordHash.current = watch('PasswordHash', '');

  // Handle form submission
  const onSubmit = async (formData) => {
    setIsProcessing(true);
    setRegisterError('');
    try {
      await authService.register({
        ...formData
      });
      
      navigate('/login', {
        state: { registrationSuccess: true }
      });
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const commonIconProps = { size: 16, color: theme.palette.grey[700] };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container rowSpacing={2.5} columnSpacing={1.5}>
        <Grid item xs={12} sm={6}>
          <InputLabel>First Name</InputLabel>
          <OutlinedInput
            {...register('Firstname', firstNameSchema)}
            placeholder="Enter first name"
            fullWidth
            error={Boolean(errors.Firstname)}
            sx={{ ...inputSx }}
          />
          {errors.Firstname?.message && <FormHelperText error>{errors.Firstname?.message}</FormHelperText>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Last Name</InputLabel>
          <OutlinedInput
            {...register('Lastname', lastNameSchema)}
            placeholder="Enter last name"
            fullWidth
            error={Boolean(errors.lastname)}
            sx={{ ...inputSx }}
          />
          {errors.Lastname?.message && <FormHelperText error>{errors.Lastname?.message}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Username</InputLabel>
          <OutlinedInput
            {...register('Username')}
            placeholder="user123"
            fullWidth
            error={Boolean(errors.username)}
            sx={{ ...inputSx }}
          />
          {errors.Username?.message && <FormHelperText error>{errors.Username?.message}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            {...register('PasswordHash', passwordSchema)}
            type={isOpen ? 'text' : 'password'}
            placeholder="Enter password"
            fullWidth
            autoComplete="new-password"
            error={Boolean(errors.PasswordHash)}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
              </InputAdornment>
            }
            sx={inputSx}
          />
          {errors.PasswordHash?.message && <FormHelperText error>{errors.PasswordHash?.message}</FormHelperText>}
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            {...register('confirmPassword', { 
              validate: (value) => value === PasswordHash.current || 'The passwords do not match' 
            })}
            type={isConfirmOpen ? 'text' : 'password'}
            placeholder="Enter confirm password"
            fullWidth
            error={Boolean(errors.confirmPassword)}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => setIsConfirmOpen(!isConfirmOpen)}
              >
                {isConfirmOpen ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
              </InputAdornment>
            }
            sx={inputSx}
          />
          {errors.confirmPassword?.message && <FormHelperText error>{errors.confirmPassword?.message}</FormHelperText>}
        </Grid>
      </Grid>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={isProcessing}
        endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
        sx={{ minWidth: 120, mt: { xs: 2, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
      >
        Sign Up
      </Button>
      {registerError && (
        <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
          {registerError}
        </Alert>
      )}
    </form>
  );
}

AuthRegister.propTypes = { inputSx: PropTypes.any };