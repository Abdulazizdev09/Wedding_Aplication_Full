// store/useAuthStore.js
import { create } from "zustand";

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("authToken");

const useAuthStore = create((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authToken", token);
    set({ user, token });
  },

  logout: (navigate) => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("redirectAfterLogin");
    set({ user: null, token: null });
    
    // Navigate to login and replace current history entry
    if (navigate) {
      navigate("/login", { replace: true });
    }
  },

  // Force logout for automatic logouts (like token expiry)
  forceLogout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("redirectAfterLogin");
    set({ user: null, token: null });
    
    // Use window.location.replace to completely clear history
    window.location.replace('/login');
  },

  isAuthenticated: () => {
    const state = get();
    return !!(state.user && state.token);
  },

  // Helper function to get user info for booking
  getUserInfo: () => {
    const state = get();
    if (state.user) {
      return {
        id: state.user.id,
        firstName: state.user.first_name,
        lastName: state.user.last_name,
        phone: state.user.phone,
        username: state.user.username
      };
    }
    return null;
  },
}));

export default useAuthStore;