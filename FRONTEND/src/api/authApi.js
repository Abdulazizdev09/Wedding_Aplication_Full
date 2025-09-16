import apiClient from "./axiosInstance";


export const login = async (username, password) => {
    try {
        const response = await apiClient.post('auth/login', { username, password })
        return response.data
    }
    catch (error) {
        throw error
    }
}

export const register = async (data) => {
    try {
        const response = await apiClient.post('auth/register', data)
        return response.data
    }
    catch (error) {
        throw error
    }
}