import { CheckSquare } from "react-feather"
import React from "react"

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-green-500" />
            <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <div>
            <span className="text-sm text-gray-500">MERN Stack Project</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
