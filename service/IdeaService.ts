import axios from "axios";
import { Idea } from "@/ds/idea.dto";

const IDEA_BACKEND_URL = "http://localhost:8080/api/student-portal/idea";

export const createIdea = (idea: { username: string; title: string; description: string; createdAt: string; sdgs: number[] }) =>
    axios.post(`${IDEA_BACKEND_URL}/create`, idea);

export const updateIdea = (ideaId: number, updateData: { username: string; title: string; description: string; sdgs: number[] }) =>
    axios.put(`${IDEA_BACKEND_URL}/${ideaId}`, updateData);

export const deleteIdea = (ideaId: number, username: string) =>
    axios.delete(`${IDEA_BACKEND_URL}/${ideaId}`, { params: { username } });

export const giveRosesToIdea = (ideaId: number, username: string, roses: number) =>
    axios.post(`${IDEA_BACKEND_URL}/${ideaId}/give-rose`, null, { params: { username, roses } });

export const getAllIdeas = () =>
    axios.get<Idea[]>(`${IDEA_BACKEND_URL}/all`);
