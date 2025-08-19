import React from 'react'

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-7xl font-bold text-red-500">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold mt-4 text-gray-800">
                    Oops! Page not found.
                </h2>
                <p className="mt-2 text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>
        </div>
    );
}


export default NotFound
