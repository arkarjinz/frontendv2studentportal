import axios from "axios";
import {getToken, logout} from "@/service/AuthService";
import { Post } from "@/ds/post.dto";

axios.interceptors.request.use(
    (config) => {
        config.headers["Authorization"] = getToken();
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            logout();
            window.dispatchEvent(new CustomEvent("authChange"));
        }
        return Promise.reject(error);
    }
);

const POST_BACKEND_URL = "http://localhost:8080/api/student-portal/post";

export const createPost = (postDto: Post) =>
    axios.post(`${POST_BACKEND_URL}`, postDto);

export const deletePost = (postId: number, postOwner: string) =>
    axios.delete(`${POST_BACKEND_URL}/${postId}`, { params: { postOwner } });

export const updatePost = (postId: number, postOwner: string, newContent: string) =>
    axios.put(`${POST_BACKEND_URL}/${postId}`, { content: newContent }, { params: { postOwner } });

// Like endpoint
export const likePost = (postId: number, username: string) =>
    axios.post(`${POST_BACKEND_URL}/${postId}/like`, null, { params: { username } });

// Unlike endpoint
export const unlikePost = (postId: number, username: string) =>
    axios.post(`${POST_BACKEND_URL}/${postId}/unlike`, null, { params: { username } });

// Fetch liked posts for the user
export const getLikedPosts = (username: string) =>
    axios.get(`${POST_BACKEND_URL}/liked`, { params: { username } });
