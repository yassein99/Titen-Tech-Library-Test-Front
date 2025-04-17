import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography, Link } from '@mui/material';
import AuthLogin from '../../sections/auth/AuthLogin';
import Copyright from '../../sections/auth/Copyright';
import loginImg from '../../assets/img/login.jpg';
export default function Login() {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      <Box sx={{
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 2, md: 4 },
        backgroundColor: 'background.paper',
        maxWidth: { xs: '100%', sm: 458 },
        mx: 'auto',
        background:'linear-gradient(135deg,rgb(251, 246, 228),rgb(255, 255, 255))'
      }}>
        <Box sx={{ width: '100%' }}>
          <Stack sx={{ 
            gap: { xs: 1, sm: 1.5 },
            textAlign: 'center',
            mb: { xs: 3, sm: 8 }
          }}>
            <Typography variant="h1">Sign In</Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Select the method of login.
            </Typography>
          </Stack>
          
          <AuthLogin />

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}
          >
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/register"
              underline="hover" 
              variant="subtitle2" 
              sx={{ 
                '&:hover': { 
                  color: 'primary.dark' 
                } 
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
        <br></br>
        <br></br>

        <Copyright />
      </Box>

      <Box sx={{
        width: { xs: 0, md: '50%' },
        position: 'relative',
        //background: 'linear-gradient(135deg,rgb(242, 247, 252),rgb(203, 225, 255),rgb(146, 193, 255),rgb(91, 162, 255),rgb(33, 129, 255))',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${loginImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7,
          mixBlendMode: 'overlay'
        }
      }} />
    </Box>
  );
}