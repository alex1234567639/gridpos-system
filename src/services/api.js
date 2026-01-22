import axios from "axios";
// 創建 axios 實例
const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    maxRedirects: 5, // 支援重定向（Apps Script 需要）
});
// 請求攔截器
api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 響應攔截器
api.interceptors.response.use((response) => {
    if (import.meta.env.VITE_APP_SHOW_LOG === "true") {
        console.log(`URL: ${response.config.url}`);
        console.log("RES.DATA:", response.data);
    }
    return response.data;
}, (error) => {
    // 處理錯誤響應
    if (error.response) {
        if (import.meta.env.VITE_APP_SHOW_LOG === "true") {
            console.error(`URL: ${error.config.url}`);
            console.error("ERROR:", error.response.data);
        }
        switch (error.response.status) {
            case 401:
                error.message = "error.unauthorized";
                break;
            case 403:
                error.message = "error.forbidden";
                break;
            case 404:
                error.message = "error.notFound";
                break;
            case 500:
                error.message = "error.serverError";
                break;
            default:
                error.message = "error.unknownError";
        }
    }
    else if (error.request) {
        error.message = "error.noResponse";
    }
    else {
        error.message = "error.requestError";
    }
    return Promise.reject(error);
});
// 封裝 GET 請求
export const get = (url, params) => {
    return api.get(url, { params });
};
// 封裝 POST 請求
export const post = (url, data) => {
    return api.post(url, data);
};
// 封裝 PUT 請求
export const put = (url, data) => {
    return api.put(url, data);
};
// 封裝 DELETE 請求
export const del = (url, params) => {
    return api.delete(url, { params });
};
export default api;
