import { useState, useEffect } from 'react'
import {
  Outlet, // 路由出口 占位符
  useNavigate, // 路由导航
  useLocation // 路由信息
} from 'react-router-dom'
import { Tabbar } from 'react-vant'
import { HomeO, Search, FriendsO, SettingO, UserO } from '@react-vant/icons'

// 菜单配置
const tabs = [
  { icon: <HomeO />, title: '首页', path: '/home' },
  { icon: <Search />, title: '地图', path: '/map' },
  { icon: <FriendsO />, title: '行程', path: '/itinerary' },
  { icon: <SettingO />, title: 'AI助手', path: '/aiassistant' },
  { icon: <UserO />, title: '我的', path: '/user' }
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
    <>
      <Outlet />
      {/* tabbar */}
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
    </>
  )
}

export default MainLayout
