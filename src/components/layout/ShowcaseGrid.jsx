import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Typography,
  Button,
  Modal,
  Card,
  CardMedia,
  Stack,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close'; 
import defaultBookImage from '../../assets/img/book1.jpg';
import { bookService } from '../../api/book';
import { borrowService } from '../../api/borrow';


const ShowcaseGrid = ({ heading, description, sections }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [registerError, setRegisterError] = useState('');
  const [borroingMsg, setBorroingMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = (item) => {
    setSelected(item);
    setOpen(true);
    setRegisterError(''); 
    setBorroingMsg('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setRegisterError('');
    setBorroingMsg('');
  };

  const handleBorrow = async () => {
    setIsLoading(true);
    setRegisterError('');
    setBorroingMsg('');
    
    try {
      
      const isAvailable = bookService.isAvailable(selected.id);
      
      if (!isAvailable) {
        setRegisterError('This book is not available now');
      } else {
        const borrowing = await  borrowService.BorrowBook(selected.id);
        
        console.log(borrowing);
        if(borrowing === "Book borrowed successfully"){
          selected.isAvailable = false;
          setBorroingMsg(borrowing);
        }else {
          setRegisterError(borrowing);
        }
          
      }
    } catch (error) {
      setRegisterError('Failed to borrow book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {heading}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {sections.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => handleOpen(item)}
              style={{ cursor: 'pointer' }}
            >
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: 'center',
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {!item.isAvailable && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'error.main',
                      color: 'white',
                      px: 1,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    Unavailable
                  </Box>
                )}
                {item.isAvailable && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 1,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 'bold'
                    }}
                  >
                    available
                  </Box>
                )}
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{ height: 140, objectFit: 'contain', mb: 2 }}
                  onError={(e) => {
                    e.target.src = defaultBookImage;
                  }}
                />
                <Typography variant="h6" color="primary">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.subTitle}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
        {description}
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          {selected && (
            <Stack spacing={2}>
              <Typography variant="h5" color="primary">
                {selected.title}
              </Typography>
              <CardMedia
                component="img"
                image={selected.image}
                alt={selected.title}
                sx={{ height: 180, objectFit: 'cover', borderRadius: 2 }}
                onError={(e) => {
                  e.target.src = defaultBookImage;
                }}
              />
              <Typography variant="body1" color="text.secondary">
                {selected.details}
              </Typography>

              {registerError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {registerError}
                </Alert>
              )}
              {borroingMsg && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {borroingMsg}
                </Alert>
              )}

              <Button 
                variant="contained" 
                onClick={handleBorrow}
                disabled={isLoading || !selected?.isAvailable}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? 'Processing...' : 'Borrow'}
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

ShowcaseGrid.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      title: PropTypes.string,
      subTitle: PropTypes.string,
      details: PropTypes.string,
      isAvailable: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) 
    })
  ).isRequired
};

export default ShowcaseGrid;