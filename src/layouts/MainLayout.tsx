import Header from "@/components/header"
import React from "react"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      {children}
    </div>

  )
}

export default MainLayout