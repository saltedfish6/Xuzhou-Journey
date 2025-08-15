import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/vant-override.css' // 覆盖 React Vant 样式
import { BrowserRouter as Router } from 'react-router-dom'
import 'lib-flexible' // 引入移动端适配
import App from './App.tsx'
import AuthGuard from './components/AuthGuard'

createRoot(document.getElementById('root')!).render(
  <Router>
    <AuthGuard>
      <App />
    </AuthGuard>
  </Router>
)
