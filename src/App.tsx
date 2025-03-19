// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import ProjectPage from './pages/ProyectPage';
import { useAuth } from './context/AuthContext';
import GridPage from './pages/GridPage';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/project"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
         <Route
          path="/grilla"
          element={
            <PrivateRoute>
              <GridPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;