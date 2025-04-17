import React, { useState } from 'react';
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
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from '@mui/icons-material/Delete';
import unavailable from '../../assets/img/unavailable.png';
import available from '../../assets/img/available.png';
import defaultBookImage from '../../assets/img/book1.jpg';

const BooksTable = ({ books }) => {
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const paginatedBooks = books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    const addNewBook = () =>{
        console.log("add new book");
    }
    const deleteBook = (id) =>{
        console.log("del book",id);
    }
  return (
    <Box sx={{ p: 3 }}>
        
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      <Button 
        variant="outlined" 
        onClick={addNewBook}
        sx={{ mb: 2 }}
      >
        + new
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="borrowed books table">
          <TableHead>
            <TableRow>
              <TableCell>ImageUrl</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>IsAvailable</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell><img 
                    src={book.imageUrl}
                    alt={"bookImage"} 
                    style={{ width: '50px', height: '80px' }}
                    onError={(e) => {
                        e.target.src = defaultBookImage;
                    }}
                    /></TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>
                <img 
                    src={book.isAvailable ? available : unavailable} 
                    alt={book.isAvailable ? "Available" : "Unavailable"} 
                    style={{ width: '24px', height: '24px' }}
                    />
                </TableCell>
                <TableCell>
                    <Button 
                        variant="outlined" 
                        color="error"
                        onClick={() => deleteBook(book.id)}
                        >
                        <DeleteIcon />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={books.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </TableContainer>
    </Box>
  );
};

export default BooksTable;