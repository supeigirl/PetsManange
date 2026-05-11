
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * 应用入口文件
 * 负责将 React 根组件挂载到 HTML 的 #root 节点上
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
