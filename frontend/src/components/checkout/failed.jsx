import React from 'react'

const Failed = () => {
  return (
    // Outer container to center the alert box on the screen
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      
      {/* The Alert Box */}
      <div 
        className='p-6 bg-red-100 border border-red-400 text-red-800 rounded-xl shadow-lg max-w-md w-full text-center'
        role="alert"
      >
        {/* Optional: Add a small icon for visual impact */}
        <svg className="mx-auto h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <p className='mt-3 text-xl font-bold'>
            Order Failed
        </p>
        
        <p className='mt-1 text-base font-medium'>
            Failed to Create An order. Try Again.
        </p>
      </div>
    </div>
  )
}

export default Failed
