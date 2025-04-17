//import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './stores/store';
import AppRoutes from './routes/AppRoutes';
/*import { useEffect } from 'react';
import { auth } from './utils/auth';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/auth/authSlice';
import { authService } from './api/auth';*/

function App() {
  /*const dispatch = useDispatch();
  useEffect(() => {
    if (auth.isTokenValid()) {
      authService.getProfile()
        .then(user => dispatch(login(user)))
        .catch(() => {
          auth.removeToken();
          dispatch(logout());
        });
    }
  }, [dispatch]);*/

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
