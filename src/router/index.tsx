import {createBrowserRouter} from 'react-router-dom';
import Chat from '../Chat';
import Nav from '../Nav';
import Version from '../Version.js';
import {Dashboard} from "../Dashboard.tsx";

// 创建路由配置
const router = createBrowserRouter([
    {
        path: '/zhm-react/',
        element: <Nav/>,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard/>,
                index: true,
            },
            {
                path: 'version',
                element: <Version/>,
            },
            {
                path: 'chat',
                element: <Chat/>
            },

        ]
    },
    {
        path: '*',
        element: <h1>404 页面未找到</h1>,
    }
]);

export default router
