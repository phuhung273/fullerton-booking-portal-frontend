import http from "./httpClient";

/**
 * Basic auth
 */
function login(username: string, password: string) {
    return http.post("/auth/login", {
        username,
        password,
    });
};

/**
 * Handshake is just like login but use only bearer token
 */
function handshake() {
    return http.get("/auth/handshake");
};

export default {
    handshake,
    login,
}