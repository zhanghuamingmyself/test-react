import {StrictMode} from 'react'
import {RouterProvider} from "react-router-dom";
import router from './router'

export default function APP() {
    return <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
}
