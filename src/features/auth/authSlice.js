import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = {
        id: action.payload.user.id,
        username: action.payload.user.username,
        firstName: action.payload.user.firstName,
        lastName: action.payload.user.lastName,
        role: action.payload.user.role,
      };
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;