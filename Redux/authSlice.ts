import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

interface SerializableUser {
    uid: string;
    email: string | null;
}

interface AuthState {
    user: SerializableUser | null;
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
        setUser: (state, action: PayloadAction<SerializableUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.loading = false;
        },

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isSubscribed = false;
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

export const { setUser, setLoading, setSubscriptionsStatus, clearAuth } = authSlice.actions;
export default authSlice.reducer;