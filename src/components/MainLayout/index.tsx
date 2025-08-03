import { useState, useEffect } from 'react'
import {
  Outlet, // 路由出口 占位符
  useNavigate, // 路由导航
  useLocation // 路由信息
} from 'react-router-dom'
import { Tabbar } from 'react-vant'
import { HomeO, LocationO, TodoListO, ChatO, UserO } from '@react-vant/icons'
import styles from './main-layout.module.styl'

// 菜单配置 - 更新图标和标题
const tabs = [
  { icon: <HomeO />, title: '首页', path: '/home' },
  { icon: <LocationO />, title: '地图', path: '/map' },
  { icon: <TodoListO />, title: '行程', path: '/itinerary' },
  { icon: <ChatO />, title: 'AI助手', path: '/aiassistant' },
  { icon: <UserO />, title: '个人中心', path: '/user' }
]

const MainLayout = () => {
  const [active, setActive] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  // 根据当前路径设置默认高亮项
  useEffect(() => {
    console.log('location', location)
    const index = tabs.findIndex((tab) =>
      location.pathname.startsWith(tab.path)
    )
    if (index !== -1) {
      setActive(index)
    }
  }, [location.pathname])

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Outlet />
      {/* 自定义样式的底部导航栏 - 悬浮在底部并留有空间 */}
      <div className={styles.customTabbar}>
        <Tabbar
          value={active}
          onChange={(key) => {
            const index = Number(key)
            setActive(index)
            navigate(tabs[index].path)
          }}
        >
          {tabs.map((tab, index) => {
            return (
              <Tabbar.Item key={index} icon={tab.icon}>
                {tab.title}
              </Tabbar.Item>
            )
          })}
        </Tabbar>
      </div>
    </div>
  )
}

export default MainLayout
