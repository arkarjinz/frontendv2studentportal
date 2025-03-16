import axios from "axios";
import { getToken } from "@/service/AuthService";
import { MarketplaceItemDto, ExchangeHistoryDto } from "@/ds/marketplace.dto";

axios.interceptors.request.use(config => {
    config.headers["Authorization"] = getToken();
    return config;
}, error => Promise.reject(error));

const MARKETPLACE_URI = "http://localhost:8080/api/student-portal/marketplace";

export const createMarketplaceItem = (formData: FormData) =>
    axios.post(`${MARKETPLACE_URI}/item`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateMarketplaceItem = (id: number, formData: FormData) =>
    axios.put(`${MARKETPLACE_URI}/item/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const deleteMarketplaceItem = (id: number) =>
    axios.delete(`${MARKETPLACE_URI}/item/${id}`);

export const getAllMarketplaceItems = () =>
    axios.get<MarketplaceItemDto[]>(`${MARKETPLACE_URI}/items`);

export const exchangeItem = (id: number, username: string, quantity: number) =>
    axios.post(`${MARKETPLACE_URI}/item/${id}/exchange`, null, { params: { username, quantity } });

export const getExchangeHistory = (username: string) =>
    axios.get<ExchangeHistoryDto[]>(`${MARKETPLACE_URI}/exchange-history`, { params: { username } });
