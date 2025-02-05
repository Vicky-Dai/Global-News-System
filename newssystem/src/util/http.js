import axios from "axios";
import {store} from "../redux/store";

axios.defaults.baseURL = "http://localhost:5000" /* 这样所有文件里面的URL都可以不用写全了，直接把这里设置的这一串删掉就可以用 */
/* 设置了所有请求的基础 URL，这样在发送请求时就不需要每次都写完整的 URL 了。 */
//axios.defaults.headers

// axios.defaults
// axios 拦截器 redux 学习一下

// Add a request interceptor
axios.interceptors.request.use(function (config) { /* 在请求之前拦截 */
    // Do something before request is sent
    // 显示loading
    store.dispatch({ /* http发请求前，dispatch一个payload true */
        type: "changeLoading",
        payload: true
    })
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // 隐藏loading
    store.dispatch({ 
      type: "changeLoading",
      payload: false
  })
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 隐藏loading
    store.dispatch({
      type: "changeLoading",
      payload: false
  })
    return Promise.reject(error);
  });

  /* 这段代码使用了 axios 库来处理 HTTP 请求，并且通过 axios 的拦截器功能在请求发送前和响应接收后执行一些操作。 */