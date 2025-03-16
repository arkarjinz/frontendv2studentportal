import axios from "axios";
import { LoginDto } from "@/ds/login.dto";
import { RegisterDto } from "@/ds/register.dto";

const AUTH_BACKEND_URL = 'http://localhost:8080/api/auth';

export const register = (registerDto: RegisterDto) =>
    axios.post(`${AUTH_BACKEND_URL}/register`, registerDto);

export const login = (loginDto: LoginDto) => {
    return axios.post(`${AUTH_BACKEND_URL}/login`, loginDto).then((response) => {
        // Expect login response to include token, username, and studentNumber
        const { token, username, studentNumber } = response.data;
        storeToken(token);
        savedLoggedInUser(username);
        savedLoggedInUserTnt(studentNumber);
        window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: true } }));
        return response;
    });
};

export const storeToken = (token: string) => localStorage.setItem('token', token);

export const getToken = (): string => localStorage.getItem('token') as string;

export const savedLoggedInUser = (username: string) =>
    sessionStorage.setItem('loggedInUser', username);

export const getLoggedInUser = (): string =>
    sessionStorage.getItem('loggedInUser') as string;

// NEW: Save and get the logged-in student's number (TNT)
export const savedLoggedInUserTnt = (studentNumber: string) =>
    sessionStorage.setItem('loggedInUserTnt', studentNumber);

export const getLoggedInUserTnt = (): string =>
    sessionStorage.getItem('loggedInUserTnt') as string;

export const logout = (): void => {
    sessionStorage.clear();
    localStorage.clear();
    window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: false } }));
};

export const setLoggedInUserRole = (role: string) =>
    sessionStorage.setItem('loggedInUserRole', role);

export const getLoggedInUerRole = (): string =>
    sessionStorage.getItem('loggedInUserRole') as string;

export const isUserLoggedIn = (): boolean => {
    const username = getLoggedInUser();
    return username != null;
};
