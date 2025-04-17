import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';

const BorrowedBooksTable = ({ books, onReturn, onBackToBooks  }) => {
  return (
    <Box sx={{ p: 3 }}>
        
      <Typography variant="h4" gutterBottom>
        My Borrowed Books
      </Typography>
      <Button 
        variant="outlined" 
        onClick={onBackToBooks}
        sx={{ mb: 2 }}
      >
        ← Back to All Books
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="borrowed books table">
          <TableHead>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.borrowDate}</TableCell>
                <TableCell>{book.dueDate}</TableCell>
                <TableCell>
                {!book.returned && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => onReturn(book.id)}
                  >
                    Return
                  </Button>
                )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BorrowedBooksTable;