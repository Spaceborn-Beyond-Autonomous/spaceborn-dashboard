import { getAccessToken, refreshAccessToken } from "./auth";

export async function api(path: string, options: any = {}) {
    let token = getAccessToken();

    const res = await fetch(`http://localhost:8000/api/v1/${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (!newToken) return null;

        return fetch(`http://localhost:8000/api/v1/${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newToken}`,
                ...(options.headers || {}),
            },
        }).then(r => r.json());
    }

    return res.json();
}
