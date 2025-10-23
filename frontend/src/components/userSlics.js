import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users'); // Mock API
  return response.json();
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true; // Set loading to true when fetching
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when fetch is successful
        state.users = action.payload; // Store fetched users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Capture error message
      });
  },
});

export default usersSlice.reducer;
