import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000" /* 这样所有文件里面的URL都可以不用写全了，直接把这里设置的这一串删掉就可以用 */

//axios.defaults.headers

// axios.defaults
// axios 拦截器 redux 学习一下

// Add a request interceptor
axios.interceptors.request.use(function (config) { /* 在请求之前拦截 */
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });