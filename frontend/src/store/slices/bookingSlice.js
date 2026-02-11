import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken } from '@/lib/auth';

export const fetchMyBookings = createAsyncThunk(
    'bookings/fetchMyBookings',
    async (_, { getState, rejectWithValue }) => {
        try {
            // Check cache validity (e.g., 2 minutes)
            const { bookings, lastFetch } = getState().bookings;
            const now = Date.now();
            if (bookings.length > 0 && lastFetch && (now - lastFetch < 120000)) {
                return bookings;
            }

            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/mybookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch bookings');
            return await res.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings: [],
        currentBooking: null,
        status: 'idle',
        error: null,
        lastFetch: null,
    },
    reducers: {
        invalidateBookings: (state) => {
            state.status = 'idle';
            state.lastFetch = null;
        },
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyBookings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings = action.payload;
                state.lastFetch = Date.now();
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { invalidateBookings, setCurrentBooking } = bookingSlice.actions;

export const selectAllBookings = (state) => state.bookings.bookings;
export const selectBookingStatus = (state) => state.bookings.status;

export default bookingSlice.reducer;
