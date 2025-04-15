//get the stored refresh token for the user
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        const response = await fetch("http://localhost:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw new Error("Session expired. Please login again.");
    }
};

//find the user's data from the given refresh token
export const fetchDataWithTokenRefresh = async () => {
    let accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
        throw new Error("No authentication tokens found");
    }

    let response = await fetch("http://localhost:8000/api/profile/", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    });

    if (response.status === 401) {
        accessToken = await refreshToken();
        
        response = await fetch("http://localhost:8000/api/profile/", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    return await response.json();
};