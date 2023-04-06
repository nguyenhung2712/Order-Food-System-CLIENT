import axios from 'axios';
import { getToken } from './get-token';
import Cookies from 'js-cookie';

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    },
});

export const http1 = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
    },
});

// Change request data/error here
http.interceptors.request.use(
    (config) => {
        const token = getToken();
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token ? token : ''}`,
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/signin" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await http.post("/auth/refreshtoken", {
                        refreshToken: Cookies.get('ref_token'),
                    });

                    const { accessToken } = rs.data;

                    Cookies.set('auth_token', accessToken);
                    return http(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);

export default http;
