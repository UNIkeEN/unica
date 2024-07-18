import { fetcher, request } from "@/services/request";

export async function jAccountLogin(next = "/", params = "") {
    let redirect_uri = window.location.origin + `/oauth/redirect-back/jaccount/`;
    if (params) {
        redirect_uri += `?${params}`;
    }
    // const loginUrl = `/auth/login/jaccount/?redirect_uri=${encodeURIComponent(redirect_uri)}&next=${encodeURIComponent(next)}/`;
    const loginUrl = `http://localhost:8000/auth/login/jaccount/?redirect_uri=${encodeURIComponent(redirect_uri)}&next=${encodeURIComponent(next)}/`;
    window.location.href = loginUrl;
}

export async function jAccountAuth(code:string, state:string) {
    try {
        const resp = await request.post("/auth/auth/jaccount/", {
            code,
            state,
        });
        return resp.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

