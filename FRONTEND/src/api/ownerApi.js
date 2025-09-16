import apiClient from "./axiosInstance";

// ============== HALL OWNER ROUTES (All Protected - Requires hall_owner Role) ==============

export const getOwnerBookings = async () => {
  try {
    const response = await apiClient.get('/hall-owner/get-bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    throw error;
  }
};

// ============== GET REQUESTS ==============

export const getMyHalls = async () => {
    try {
        const response = await apiClient.get('/hall-owner/my-halls');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBookings = async () => {
    try {
        const response = await apiClient.get('/hall-owner/get-bookings');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============== POST REQUESTS ==============

export const createHall = async (hallFormData) => {
    try {
        const response = await apiClient.post('/hall-owner/create-hall', hallFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============== PUT REQUESTS ==============

export const editHall = async (hallId, hallData) => {
    try {
        const response = await apiClient.put(`/hall-owner/edit-hall/${hallId}`, hallData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============== DELETE REQUESTS ==============

export const cancelBooking = async (bookingId) => {
    try {
        const response = await apiClient.delete(`/hall-owner/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHall = async (hallId) => {
    try {
        const response = await apiClient.delete(`/hall-owner/delete-hall/${hallId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};