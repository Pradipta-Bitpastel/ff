import axios from "axios";
import Cookies from "js-cookie";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const api = axios.create({
    baseURL: "/api/proxy/",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

createAuthRefreshInterceptor(api, async (failedRequest) => {
    const refresh = Cookies.get("refresh_token");
    const { data } = await axios.post(
        "/api/proxy/auth/token/refresh",
        { refresh_token: refresh }
    );
    const newAccess = data?.data?.access_token;
    Cookies.set("access_token", newAccess, { sameSite: "lax", expires: 1 / 144 });
    failedRequest.response.config.headers.Authorization = `Bearer ${newAccess}`;
});

export const callApi = async ({
    url,
    method,
    data,
}: {
    url: string;
    method: string;
    data?: any;
}) => {
    try {
        const res = await api.request({ url, method, data });
        return { ok: true, status: res.status, data: res.data?.data };
    } catch (error: any) {
        return {
            ok: false,
            status: error?.response?.status ?? 500,
            data: error?.response?.data ?? null,
            message: error?.message ?? "Request failed",
        };
    }
};
