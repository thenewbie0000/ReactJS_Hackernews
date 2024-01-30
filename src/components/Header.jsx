import React from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import './header.css';


const Header = ({ toggleTheme, mode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className= 'head'>
      <h1 onClick={handleClick} style={{cursor:'pointer'}}>Hacker News</h1>
      <Switch
        checked={mode === 'dark'}
        onChange={toggleTheme}
        color="primary"
      />
    </div>
  );
};

export default Header;
