import React from 'react'
import { Outlet } from 'react-router-dom'

const BlankLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      BlankLayout
    </>
  )
}

export default BlankLayout
