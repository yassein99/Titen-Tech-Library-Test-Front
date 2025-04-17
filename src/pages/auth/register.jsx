import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AuthRegister from '../../sections/auth/AuthRegister';
import Copyright from '../../sections/auth/Copyright';
import loginImg from '../../assets/img/login.jpg';



export default function Register() {
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
        maxWidth: { xs: '100%', sm: '100%' },
        mx: 'auto',
        background:'linear-gradient(135deg,rgb(251, 246, 228),rgb(255, 255, 255))'
      }}>
        <Box sx={{ width: '100%' }}>
          <Stack sx={{ 
            gap: { xs: 1, sm: 1.5 },
            textAlign: 'center',
            mb: { xs: 3, sm: 8 }
          }}>
            <Typography variant="h1">Sign Up</Typography>
            <Typography variant="body1" color="text.secondary">
              Sign Up for free. No credit card required.
            </Typography>
          </Stack>
          
          <AuthRegister />

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: { xs: 2, sm: 3 }, textAlign: 'center' }}
          >
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login"
              underline="hover" 
              variant="subtitle2" 
              sx={{ 
                '&:hover': { 
                  color: 'primary.dark' 
                } 
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
        <br></br>
        <br></br>
        <br></br>
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