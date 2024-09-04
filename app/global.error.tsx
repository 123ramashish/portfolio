'use client';

import { FC } from 'react';

interface GlobalErrorProps {
  error: Error;       // Adjust if you have a more specific error type
  reset: () => void;
}

const GlobalError: FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
    <html>
      <body>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h2 className="text-5xl font-mono text-violet-500">
            <span className="text-8xl">😒</span> Something went wrong!
          </h2>
          <button 
            onClick={reset} 
            className="mt-12 p-2 px-4 bg-gradient-to-r from-violet-400 to-blue-500 text-white rounded shadow-lg"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
