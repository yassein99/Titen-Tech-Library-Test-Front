import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  Snackbar,
  Alert,
  CircularProgress,
  styled
} from '@mui/material';
import { Search, Menu as MenuIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { bookService } from '../../api/book';
import { userService } from '../../api/users';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import BooksTable from './Books';
import UsersTable from './Users'; 

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '@media all': {
    minHeight: 84,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    '@media all': {
      minHeight: 72
    }
  },
  [theme.breakpoints.down('sm')]: {
    '@media all': {
      minHeight: 64
    },
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5)
  }
}));

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [state, setState] = useState({
    searchTerm: '',
    mobileOpen: false,
    loading: false,
    alert: { open: false, message: '', severity: 'success' },
    activeTab: 'books', // 'books', 'users'
    books: [],
    users: []
  });

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { 
    searchTerm, 
    mobileOpen, 
    loading, 
    alert,
    activeTab,
    books,
    users
  } = state;

  // دالة لجلب الكتب
  const fetchBooks = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await bookService.fetchBooks();
      setState(prev => ({
        ...prev,
        books: response.data,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: 'Failed to load books',
          severity: 'error'
        }
      }));
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
       const response = await userService.fetchUsers();
      const mockUsers = response.data;
      setState(prev => ({
        ...prev,
        users: mockUsers,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: 'Failed to load users',
          severity: 'error'
        }
      }));
    }
  }, []);

  const handleTabChange = (tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    if (tab === 'books') {
      fetchBooks();
    } else if (tab === 'users') {
      fetchUsers();
    }
  };

  const handleLogout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));      
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        alert: {
          open: true,
          message: 'Failed to logout',
          severity: 'error'
        }
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    console.log('Current user:', user); 
    fetchBooks(); // جلب الكتب عند التحميل الأولي
  }, [fetchBooks, user]);

  const handleAlertClose = () => {
    setState(prev => ({ ...prev, alert: { ...prev.alert, open: false } }));
  };

  const renderMobileSearch = () => (
    <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'center' }}>
      <TextField
        fullWidth
        size="small"
        label={`Search ${activeTab}`}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
        InputProps={{ endAdornment: <Search /> }}
        sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
      />
    </Box>
  );

  const renderDesktopSearch = () => (
    <Box sx={{ flexGrow: 1, px: 4, display: 'flex', justifyContent: 'center' }}>
      <TextField
        size="small"
        fullWidth
        label={`Search ${activeTab}`}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
        InputProps={{ endAdornment: <Search /> }}
        sx={{ maxWidth: '500px', '& .MuiOutlinedInput-root': { height: '40px' } }}
      />
    </Box>
  );

  const renderMainContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (activeTab === 'books') {
      return (
        <BooksTable 
          books={books.filter(book => 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
          )} 
        />
      );
    } else if (activeTab === 'users') {
      return (
        <UsersTable 
          Users={users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
          )} 
        />
      );
    }

    return null;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(254, 243, 205), rgb(251, 246, 228), rgb(255, 255, 255))'
    }}>
      <AppBar 
        position="static" 
        color="inherit" 
        elevation={0} 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          mb: 3
        }}
      >
        <StyledToolbar>
          {isMobile && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setState(prev => ({ ...prev, mobileOpen: !prev.mobileOpen }))}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          )}

          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: isMobile ? 0 : 1,
              mr: isMobile ? 2 : 0,
              fontWeight: 700,
              color: theme.palette.primary.main
            }}
          >
            Titen Tech Library
          </Typography>

          {!isMobile && renderDesktopSearch()}

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button 
              variant={activeTab === 'books' ? 'contained' : 'outlined'}
              onClick={() => handleTabChange('books')}
              sx={{ 
                backgroundColor: activeTab === 'books' ? theme.palette.primary.main : 'transparent',
                '&:hover': {
                  backgroundColor: activeTab === 'books' ? theme.palette.primary.dark : theme.palette.action.hover
                }
              }}
            >
              Books
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'contained' : 'outlined'}
              onClick={() => handleTabChange('users')}
              sx={{ 
                backgroundColor: activeTab === 'users' ? theme.palette.primary.main : 'transparent',
                '&:hover': {
                  backgroundColor: activeTab === 'users' ? theme.palette.primary.dark : theme.palette.action.hover
                }
              }}
            >
              Users
            </Button>
            <Button 
              color="error"
              variant="outlined"
              onClick={handleLogout} 
            >
              Log out
            </Button>
          </Box>
        </StyledToolbar>

        {isMobile && renderMobileSearch()}
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setState(prev => ({ ...prev, mobileOpen: false }))}
        sx={{
          '& .MuiDrawer-paper': {
            background: 'rgba(254, 251, 214, 0.9)',
            backdropFilter: 'blur(10px)',
            width: 200
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={() => {
              handleTabChange('books');
              setState(prev => ({ ...prev, mobileOpen: false }));
            }}
          >
            Books
          </Button>
          <Button 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={() => {
              handleTabChange('users');
              setState(prev => ({ ...prev, mobileOpen: false }));
            }}
          >
            Users
          </Button>
          <Button 
            fullWidth
            onClick={() => {
              handleLogout();
              setState(prev => ({ ...prev, mobileOpen: false }));
            }}
          >
            Log out
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ p: 3 }}>
        {renderMainContent()}
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={alert.severity} 
          onClose={handleAlertClose}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(UserDashboard);