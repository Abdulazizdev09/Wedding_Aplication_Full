import apiClient from "./axiosInstance";


export const getHalls = async () => {
    try {
        const response = await apiClient.get('/admin/get-halls');
        return response.data.data || response.data;
    } catch (error) {
        throw error;
    }
};



export const getBookings = async () => {
    try {
        const response = await apiClient.get('/admin/get-bookings');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOwners = async () => {
    try {
        const response = await apiClient.get('/admin/get-owners');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============== POST REQUESTS ==============

export const createOwner = async (ownerData) => {
    try {
        const response = await apiClient.post('/admin/create-owner', ownerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createHall = async (hallFormData) => {
    try {
        const response = await apiClient.post('/admin/create-hall', hallFormData, {
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
        const response = await apiClient.put(`/admin/edit-hall/${hallId}`, hallData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============== DELETE REQUESTS ==============

export const cancelBooking = async (bookingId) => {
    try {
        const response = await apiClient.delete(`/admin/cancel-booking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHall = async (hallId) => {
    try {
        const response = await apiClient.delete(`/admin/delete-hall/${hallId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};