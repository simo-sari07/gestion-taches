import React from "react"

function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  
  export default LoadingSpinner
  