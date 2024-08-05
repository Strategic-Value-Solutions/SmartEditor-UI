import React from "react";
import "./App.css";
// import LoginPage from './pages/LoginPage';
// import CreateNewProject from './pages/createNewProject';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import HomePage from "./pages/HomePage";
import store from "./redux/store";

const theme = createTheme({
  // your theme options
});
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
