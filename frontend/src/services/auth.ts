import { Token } from "@/models/token";
import { request } from "@/services/request";

export async function jAccountLogin(next = "/", params = "") {
    let redirect_uri = window.location.origin + `/oauth/redirect-back/jaccount/`;
    if (params) {
        redirect_uri += `?${params}`;
    }

    const loginUrl = (process.env.NODE_ENV === 'development') 
        ? `http://localhost:8000/auth/login/jaccount/?redirect_uri=${encodeURIComponent(redirect_uri)}&next=${encodeURIComponent(next)}`
        : window.location.origin + `/auth/login/jaccount/?redirect_uri=${encodeURIComponent(redirect_uri)}&next=${encodeURIComponent(next)}/`;
    window.location.href = loginUrl;
}

export async function jAccountAuth(code:string, state:string) {
    try {
        const response = await request.post("/auth/auth/jaccount/", {
            code,
            state,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to login:', error);
        throw error;
    }
}

export async function jAccountRefresh(refreshToken: string) {
    try {
        const response = await request.post("/auth/oidc_refresh/", {
            refresh_token: refreshToken,
        });
        return ({
            token: response.data.token,
            refreshToken: response.data.refresh_token,
        } as Token);
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
    }
}

export async function Logout() {
    try {
        await request.post('/oauth/logout/');
    } catch (error) {
        console.error('Failed to logout:', error);
    }
};