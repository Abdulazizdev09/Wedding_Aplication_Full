import apiClient from "./axiosInstance";

// ============== PUBLIC CLIENT ROUTES (No Auth Required) ==============

export const getHallsPublic = async () => {
    try {
        const response = await apiClient.get('/public/get-halls');
        return response.data;
    } catch (error) {
        console.error('Get Halls Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getHallById = async (hall_id) => {
    try {
        const response = await apiClient.get(`/public/get-hall/${hall_id}`);
        return response.data;
    } catch (error) {
        console.error('Get Hall Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getHallBookings = async (hall_id) => {
    try {
        const response = await apiClient.get(`/public/hall-bookings/${hall_id}`);
        return response.data;
    } catch (error) {
        console.error('Get Hall Bookings Error:', error.response?.data || error.message);
        throw error;
    }
};

// ============== PROTECTED CLIENT ROUTES (Requires Client Role) ==============

export const getBookings = async () => {
    try {
        const response = await apiClient.get('/client/my-bookings');
        
        // 🔄 FIXED: Your backend returns result.rows directly, not wrapped in data
        return {
            data: response.data  // response.data IS the array of bookings
        };
    } catch (error) {
        console.error('Get Bookings Error:', error.response?.data || error.message);
        throw error;
    }
};

export const createBooking = async (bookingData) => {
    try {
        const response = await apiClient.post('/client/create-booking', bookingData);
        return response.data;
    } catch (error) {
        console.error('Create Booking Error:', error.response?.data || error.message);
        throw error;
    }
};

export const cancelBooking = async (bookingId) => {
    try {
        const response = await apiClient.delete(`/client/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error('Cancel Booking Error:', error.response?.data || error.message);
        throw error;
    }
};