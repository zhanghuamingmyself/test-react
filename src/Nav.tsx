// Nav.js
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {Tabs} from "antd-mobile";

const Nav = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Tabs style={{position: "fixed", top: 50, left: 0,width:"100%"}} onChange={(v) => {
                navigate(v);
            }}>
                <Tabs.Tab title='version' key='version'>
                </Tabs.Tab>
                <Tabs.Tab title='chat' key='chat'>
                </Tabs.Tab>
            </Tabs>
            <Outlet/> {/* 用于渲染嵌套路由的内容 */}
        </div>
    );
};

export default Nav;
