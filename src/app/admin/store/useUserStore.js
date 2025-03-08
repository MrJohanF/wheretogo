// store/useUserStore.js
import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null,

  // Fetch all users
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      if (data.success) {
        set({ users: data.users || [], isLoading: false });
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Error fetching users:', error);
    }
  },

  // Get user by ID
  fetchUserById: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const data = await response.json();
      if (data.success) {
        set({ selectedUser: data.user, isLoading: false });
        return data.user;
      } else {
        throw new Error(data.message || 'Failed to fetch user');
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Add new user
  addUser: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add the new user to the current list
        set(state => ({ 
          users: [...state.users, data.user], 
          isLoading: false 
        }));
        return { success: true, user: data.user };
      } else {
        throw { 
          message: data.message || 'Failed to create user',
          errors: data.errors 
        };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'An error occurred' });
      return { 
        success: false, 
        error: error.message || 'An error occurred', 
        errors: error.errors 
      };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the user in the list
        set(state => ({
          users: state.users.map(user => 
            user.id === userId ? { ...user, ...data.user } : user
          ),
          selectedUser: null,
          isLoading: false
        }));
        return { success: true, user: data.user };
      } else {
        throw { 
          message: data.message || 'Failed to update user',
          errors: data.errors 
        };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'An error occurred' });
      return { 
        success: false, 
        error: error.message || 'An error occurred',
        errors: error.errors 
      };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove user from the list
        set(state => ({
          users: state.users.filter(user => user.id !== userId),
          isLoading: false
        }));
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'An error occurred' });
      return { success: false, error: error.message || 'An error occurred' };
    }
  },

  // Clear selected user
  clearSelectedUser: () => set({ selectedUser: null }),

  // Reset errors
  clearError: () => set({ error: null }),
}));

export default useUserStore;