import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isSubscribed: boolean;
    loading: boolean;
}

const initialState: AuthState = {
        user: null,
    isAuthenticated: false,
    isSubscribed: false,
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },

        setSubscriptionsStatus: (state, action: PayloadAction<boolean>) => {
            state.isSubscribed = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { setUser, setLoading, setSubscriptionsStatus } = authSlice.actions;
export default authSlice.reducer;