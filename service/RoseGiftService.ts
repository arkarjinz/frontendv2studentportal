import axios from "axios";
import {getToken} from "@/service/AuthService";
import {RoseUpdate} from "@/ds/rose.update";


axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers["Authorization"]=getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const ROSE_GIFT_URI = "http://localhost:8080/api/rose-gift";
//@PostMapping("http://localhost:8080/api/rose-gift/send-rose/{fromUsername}/{toUsername}/{roses}")

export const giveRoseGift = (fromUserName:string,toUserName:string,roses:number) => axios.post(`${ROSE_GIFT_URI}/send-rose/${fromUserName}/${toUserName}/${roses}`);

export const updateRouseCount = (roseUpdate:RoseUpdate)=>
    axios.post(`${ROSE_GIFT_URI}/update-rose-count`,roseUpdate);