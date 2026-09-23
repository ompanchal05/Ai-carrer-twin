import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '13px'
                  }
                }}
              />
              <AppRoutes />
            </BrowserRouter>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
