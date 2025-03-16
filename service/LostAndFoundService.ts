// LostAndFoundService.ts
import axios from "axios";
import { getToken } from "@/service/AuthService";

axios.interceptors.request.use(function (config) {
    config.headers["Authorization"] = getToken();
    return config;
}, function (error) {
    return Promise.reject(error);
});

const LOST_AND_FOUND_URI = "http://localhost:8080/api/student-portal/lost-and-found";

export const createLostAndFound = (formData: FormData, id: number) =>
    axios.post(`${LOST_AND_FOUND_URI}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const toggleLostAndFoundStatus = (itemId: number, isFound: boolean) =>
    axios.patch(`${LOST_AND_FOUND_URI}/${itemId}/toggle?isFound=${isFound}`);
