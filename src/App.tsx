import './App.css'
import './App.css'
import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'

const Home = lazy(() => import('@/pages/Home'))
const Map = lazy(() => import('@/pages/Map'))
const Itinerary = lazy(() => import('@/pages/Itinerary'))
const AIAssistant = lazy(() => import('@/pages/AIAssistant'))
const User = lazy(() => import('@/pages/User'))
const Search = lazy(() => import('@/pages/Search'))
function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      {/* 带有tabbar的Layout */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/map" element={<Map />} />
          <Route path="/aiassistant" element={<AIAssistant />} />
          <Route path="/user" element={<User />} />
        </Route>

        {/* blank的Layout */}
        <Route element={<BlankLayout />}>
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
