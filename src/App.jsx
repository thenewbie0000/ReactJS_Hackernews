import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Front from './components/Front';
import Comments from './components/Comments';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header'; 

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = React.useMemo(() => createTheme(mode === 'dark' ? darkTheme : lightTheme), [mode]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header toggleTheme={toggleTheme} mode={mode} />
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/comments" element={<Comments />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}


export default App;
