export const auth = {
  // تخزين التوكن مع وقت لانتهاء
  setToken: (token, expiresIn = 3600) => { 
    const tokenData = {
      token,
      expires: Date.now() + expiresIn * 1000
    };
    localStorage.setItem('auth', JSON.stringify(tokenData));
  },

  getToken: () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.token;
  },

  isTokenValid: () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth && auth.expires > Date.now();
  },

  removeToken: () => {
    localStorage.removeItem('auth');
  },

  isAuthenticated: () => {
    return this.isTokenValid();
  }
};