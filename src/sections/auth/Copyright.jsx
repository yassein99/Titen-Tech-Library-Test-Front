import { Link as RouterLink } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/***************************  AUTH - COPYRIGHT  ***************************/

export default function Copyright() {
  const brandName = "Yassein Yassein";
  
  const copyrightSX = { display: { xs: 'none', sm: 'flex' } };

  const linkProps = {
    component: RouterLink,
    variant: 'caption',
    color: 'text.secondary',
    target: '_blank',
    underline: 'hover',
    sx: { '&:hover': { color: 'primary.main' } }
  };

  return (
    <Stack sx={{ gap: 1, width: 'fit-content', mx: 'auto' }}>
      <Stack direction="row" sx={{ justifyContent: 'center', gap: { xs: 1, sm: 1.5 }, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={copyrightSX}>
          © 2025 {brandName}
        </Typography>
        <Divider orientation="vertical" flexItem sx={copyrightSX} />
        <Link 
          {...linkProps} 
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>
        <Divider orientation="vertical" flexItem />
        <Link 
          {...linkProps} 
          to="/terms" 
        >
          Terms & Conditions
        </Link>
      </Stack>

      <Box sx={{ textAlign: 'center', display: { xs: 'block', sm: 'none' } }}>
        <Divider sx={{ marginBottom: 1 }} />
        <Typography variant="caption" color="text.secondary">
          © 2025 {brandName}
        </Typography>
      </Box>
    </Stack>
  );
}