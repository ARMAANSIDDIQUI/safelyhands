import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToken } from '@/lib/auth';

export const fetchBookingAttendance = createAsyncThunk(
    'attendance/fetchBookingAttendance',
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            // Check cache for this specific booking
            const cachedData = getState().attendance.cache[bookingId];
            const now = Date.now();

            if (cachedData && (now - cachedData.lastFetch < 60000)) { // 1 min cache for attendance
                return { bookingId, data: cachedData.data };
            }

            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/valid-dates/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch attendance');
            const data = await res.json();
            return { bookingId, data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        cache: {}, // { [bookingId]: { data: {...}, lastFetch: timestamp } }
        status: 'idle',
        error: null,
    },
    reducers: {
        invalidateAttendance: (state, action) => {
            const bookingId = action.payload;
            if (bookingId && state.cache[bookingId]) {
                delete state.cache[bookingId];
            } else {
                state.cache = {};
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingAttendance.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBookingAttendance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { bookingId, data } = action.payload;
                state.cache[bookingId] = {
                    data,
                    lastFetch: Date.now()
                };
            })
            .addCase(fetchBookingAttendance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { invalidateAttendance } = attendanceSlice.actions;

export const selectAttendanceData = (bookingId) => (state) => state.attendance.cache[bookingId]?.data;

export default attendanceSlice.reducer;
