// src/services/authService.js

// Simulated database for users
const users = [
    {
      email: 'test@gmail.com',
      password: '123456', // In a real app, this would be hashed
    }
  ];
  
  // Simulate some delay to mimic network requests
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const authService = {
    // Login function
    async login(email, password) {
      await delay(1000); // Simulate API call
      
      const user = users.find(u => u.email === email);
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Generate a fake token
      const token = `token_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      
      return { email, token };
    },
    
    // Registration function
    async register(email, password) {
      await delay(1000); // Simulate API call
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Add user to our "database"
      users.push({ email, password });
      
      return { success: true };
    },
    
    // Password reset request
    async requestPasswordReset(email) {
      await delay(1000); // Simulate API call
      
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('User not found');
      }
      
      // In a real app, we would send an email with a reset link
      console.log(`Password reset link sent to ${email}`);
      
      return { success: true };
    },
    
    // Reset password
    async resetPassword(token, newPassword) {
      await delay(1000); // Simulate API call
      
      // In a real app, we would validate the token
      // For this example, we'll just update the first user's password
      if (users.length > 0) {
        users[0].password = newPassword;
      }
      
      return { success: true };
    },
    
    // Logout
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
    },
    
    // Check if user is logged in
    isLoggedIn() {
      return !!localStorage.getItem('authToken');
    },
    
    // Get current user
    getCurrentUser() {
      return localStorage.getItem('userEmail');
    }
  };
  
  export default authService;