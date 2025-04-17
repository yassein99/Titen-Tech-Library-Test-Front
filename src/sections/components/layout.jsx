import React from 'react';
import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';

// Components
import Navbar10 from '../blocks/navbar/Navbar10';
import NavbarContent10 from '../blocks/navbar/navbar-content/NavbarContent10';

// Data
import { navbar } from '../landings/default/data';


const SectionsLayout = ({ children }) => {
  return (
    <>
      <Box sx={{ bgcolor: 'grey.100' }}>
        <Navbar10>
          <NavbarContent10 {...navbar} />
        </Navbar10>
      </Box>
      {children}
    </>
  );
};

SectionsLayout.propTypes = { 
  children: PropTypes.any 
};

export default SectionsLayout;