import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming App.jsx is correctly set up
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material';

// Define the theme directly in the same file if not using a separate theme file
const theme = createTheme({
  typography: {
    fontFamily: [
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// Render the application
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> Uncomment if CssBaseline is needed */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
