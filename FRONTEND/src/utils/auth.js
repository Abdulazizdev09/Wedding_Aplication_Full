export const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.id || null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem("authToken") || null;
};