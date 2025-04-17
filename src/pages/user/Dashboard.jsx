import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from '@mui/material/utils';
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
import { borrowService } from '../../api/borrow';
import ShowcaseGrid from '../../components/layout/ShowcaseGrid';
import BorrowedBooksTable from './BorrowedBooksTable';
import { useNavigate } from 'react-router-dom';
//import { authService } from '../../api/auth';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
//import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// ==============================|| STYLED COMPONENTS ||============================== //

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

// ==============================|| MAIN COMPONENT ||============================== //

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [state, setState] = useState({
    books: [],
    searchTerm: '',
    mobileOpen: false,
    currentView: 'dashboard',
    loading: false,
    alert: { open: false, message: '', severity: 'success' },
    borrowedBooks: [
      {
        id: 1,
        title: "React Advanced Patterns",
        author: "John Doe",
        borrowDate: "2023-05-15",
        dueDate: "2023-06-15",
        imageUrl: "../../assets/img/book1.jpg"
      }
    ]
  });
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Destructure state for easier access
  const { 
    books, 
    searchTerm, 
    mobileOpen, 
    currentView, 
    loading, 
    alert,
    borrowedBooks 
  } = state;

  // ==============================|| API HANDLERS ||============================== //

  const fetchData = useCallback(async (fetchFunction, formatData) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetchFunction();
      const formattedData = formatData(response.data);
      setState(prev => ({ ...prev, books: formattedData, loading: false }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: 'Failed to fetch data',
          severity: 'error'
        }
      }));
    }
  }, []);

  const fetchBooks = useCallback(() => {
    const formatBooks = (data) => data.map(book => ({
      image: book.imageUrl,
      title: book.title,
      subTitle: book.author,
      details: `ISBN: ${book.isbn}`,
      isAvailable: book.isAvailable,
      id: book.id
    }));
    fetchData(bookService.fetchBooks, formatBooks);
  }, [fetchData]);

  const searchBooks = useCallback((term) => {
    const formatSearchResults = (data) => data.map(book => ({
      image: book.imageUrl,
      title: book.title,
      subTitle: book.author,
      details: `ISBN: ${book.isbn} - ${book.isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable: book.isAvailable,
      id: book.id
    }));
    
    if (term.trim() !== '') {
      fetchData(() => bookService.searchBooks(term), formatSearchResults);
    } else {
      fetchBooks();
    }
  }, [fetchData, fetchBooks]);

  // ==============================|| EFFECTS ||============================== //


  const debouncedSearch = useMemo(
    () => debounce(searchBooks, 500),
    [searchBooks]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.clear();
  }, [searchTerm, debouncedSearch]);

  // ==============================|| EVENT HANDLERS ||============================== //

  const handleDrawerToggle = () => {
    setState(prev => ({ ...prev, mobileOpen: !prev.mobileOpen }));
  };

  const fetchBorrowedBooks = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error('User ID is missing');
        return;
      }
  
      console.log('Fetching borrowed books for user ID:', user.id); // Debug
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await borrowService.fetchBorrowedBooks(user.id);
      
      if (!response.data) {
        throw new Error('No data received');
      }
  
      const formattedBooks = await Promise.all(
        response.data.map(async (borrowedBook) => {
          try {
            const bookDetail = await bookService.getBookDetail(borrowedBook.bookId || borrowedBook.id);
            console.log(bookDetail);
            return {
              id: borrowedBook.id || borrowedBook._id,
              title: bookDetail.title || 'Unknown Title',
              author: bookDetail.author || 'Unknown Author',
              borrowDate: borrowedBook.borrowDate 
                ? new Date(borrowedBook.borrowDate).toLocaleDateString() 
                : 'N/A',
              dueDate: borrowedBook.returnDate 
                ? new Date(borrowedBook.returnDate).toLocaleDateString() 
                : 'N/A',
              imageUrl: bookDetail.imageUrl || '../../assets/img/book1.jpg',
              returned:borrowedBook.returnDate?true:false
            };
          } catch (error) {
            console.error(`Failed to fetch details for book ${borrowedBook.bookId}:`, error);
            return {
              id: borrowedBook.id || borrowedBook._id,
              title: 'Unknown Title',
              author: 'Unknown Author',
              borrowDate: borrowedBook.borrowDate 
                ? new Date(borrowedBook.borrowDate).toLocaleDateString() 
                : 'N/A',
              dueDate: borrowedBook.dueDate 
                ? new Date(borrowedBook.dueDate).toLocaleDateString() 
                : 'N/A',
              imageUrl: '../../assets/img/book1.jpg'
            };
          }
        })
      );
      

      setState(prev => ({
        ...prev,
        borrowedBooks: formattedBooks,
        loading: false
      }));
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: error.response?.data?.message || 'Failed to load borrowed books',
          severity: 'error'
        }
      }));
    }
  }, [user?.id]);


  const handleBackToBooks = () => {
    setState(prev => ({ ...prev, currentView: 'dashboard' }));
  };


  const handleReturnBook = async (bookId) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
       await bookService.returnBook(bookId); 
      setState(prev => ({
        ...prev,
        borrowedBooks: prev.borrowedBooks.filter(book => book.id !== bookId),
        loading: false,
        alert: {
          open: true,
          message: 'Book returned successfully!',
          severity: 'success'
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: 'Failed to return book',
          severity: 'error'
        }
      }));
    }
  };

  const handleViewChange = async (view) => {
    setState(prev => ({ ...prev, currentView: view, loading: true }));
    
    try {
      if (view === 'borrowed') {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        await fetchBorrowedBooks();
      }
    } catch (error) {
      console.error('View change error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        alert: {
          open: true,
          message: error.message,
          severity: 'error'
        }
      }));
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
    fetchBooks();
  }, [fetchBooks, user]);


  const handleAlertClose = () => {
    setState(prev => ({ ...prev, alert: { ...prev.alert, open: false } }));
  };


  const renderMobileSearch = () => (
    <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'center' }}>
      <TextField
        fullWidth
        size="small"
        label="Search books"
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
        label="Search with title, author and ISBN"
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

    return currentView === 'dashboard' ? (
      <ShowcaseGrid
        heading="Available Books"
        description="Explore our collection"
        sections={books}
      />
    ) : (
      <Box>
      <BorrowedBooksTable 
        books={borrowedBooks} 
        onReturn={handleReturnBook} 
        onBackToBooks={handleBackToBooks}
      />
    </Box>
    );
  };

  // ==============================|| MAIN RENDER ||============================== //

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(254, 243, 205), rgb(251, 246, 228), rgb(255, 255, 255))'
    }}>
      {/* App Bar */}
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
                onClick={handleDrawerToggle}
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
              variant={currentView === 'borrowed' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('borrowed')}
              sx={{ 
                backgroundColor: currentView === 'borrowed' ? theme.palette.primary.main : 'transparent',
                '&:hover': {
                  backgroundColor: currentView === 'borrowed' ? theme.palette.primary.dark : theme.palette.action.hover
                }
              }}
            >
              My Borrowing
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
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
              handleViewChange('dashboard');
              handleDrawerToggle();
            }}
          >
            Browse Books
          </Button>
          <Button 
            fullWidth 
            sx={{ mb: 2 }}
            onClick={() => {
              handleViewChange('borrowed');
              handleDrawerToggle();
            }}
          >
            My Borrowing
          </Button>
          <Button 
            fullWidth
            onClick={() => {
              handleLogout();
              handleDrawerToggle();
            }}
          >
            Log out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {renderMainContent()}
      </Box>

      {/* Notification Snackbar */}
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

// Prop type validation
UserDashboard.propTypes = {
  // Add any props validation if needed
};

export default React.memo(UserDashboard);