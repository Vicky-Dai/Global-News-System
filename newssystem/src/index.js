import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter} from 'react-router-dom'
import './util/http'
/* import {Route, Routes, HashRouter, Navigate, BrowserRouter} from 'react-router-dom'
import IndexRouter from './router/IndexRouter';
import Login from './views/login/Login';
import NewsSandBox from './views/sandbox/NewsSandBox';
import Home from './views/sandbox/home/Home';
import UserList from './views/sandbox/user-manage/UserList'; */
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); /* 跟组件 */
root.render(
//  <React.StrictMode>
    <BrowserRouter>{/* 一种路由器类型，使用URLhash的部分即#后面的内容来管理和解析 */}
        <App /> 
    </BrowserRouter> /* 路由器组件，将路由和组件关联起来 新版必须把子组建包裹在路由里面，从而能够识别所有Route*/


 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(); 生成一些web报告 先不用
