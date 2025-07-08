import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: App,
    errorBoundary(err, info, props) {
        // 自定义错误边界
        return <div>Error in sub-app: {err.message}</div>;
    },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;

// 独立运行时，正常挂载应用
if (!window.__MICRO_APP_ENVIRONMENT__) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
}else{
    console.log('微前端环境下，不执行独立运行逻辑')
}
