import axios from 'axios';

// 題目給定的 Base URL
const BASE_URL = 'https://6605.wu.elitepro.ltd';

export const useApi = () => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });

  // 可以在這裡加入攔截器 (Interceptors) 處理錯誤
  return api;
};