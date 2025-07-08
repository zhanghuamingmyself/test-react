import {Link} from "react-router-dom";
import {useEffect} from "react";

export function Dashboard() {

    useEffect(() => {
        window.microApp.addDataListener((data) => {
            console.log('来自主应用的数据', data)
            return '返回值2'
        })
    }, []);
    return (
        <div>
            <div>123</div>
            <Link to={'/zhm-react/chat'}>调整</Link>
            <button onClick={() => {
                console.log(window.rawWindow
                )
                window.microApp.dispatch({name: 'jack'})
            }}>获取主应用信息
            </button>
        </div>
    )
}
