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

const UsersTable = ({ Users }) => {
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const paginatedUsers = Users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
      
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    const addNewUser = () =>{
        console.log("add new book");
    }
    const deleteUser = (id) =>{
        console.log("del book",id);
    }
  return (
    <Box sx={{ p: 3 }}>
        
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Button 
        variant="outlined" 
        onClick={addNewUser}
        sx={{ mb: 2 }}
      >
        + new
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="borrowed books table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                    <Button 
                        variant="outlined" 
                        color="error"
                        onClick={() => deleteUser(user.id)}
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
            count={Users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
      </TableContainer>
    </Box>
  );
};

export default UsersTable;