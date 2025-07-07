import {createRoot} from 'react-dom/client'
import './index.css'
import 'tailwindcss/tailwind.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
    App()
)
