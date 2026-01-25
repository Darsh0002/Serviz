import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full animate-fadeIn text-center">
        {/* Error Code */}
        <div className="text-8xl font-black bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent mb-4">
          403
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          Sorry, you don't have permission to access this page. 
          Your account doesn't have the required privileges.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mb-10 sm:flex-row sm:justify-center">
          <button 
            onClick={() => navigate("/")}
            className="px-7 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            ← Back to Home
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="px-7 py-3 bg-gray-100 text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-600 hover:text-white hover:-translate-y-1 transition-all duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Security Icon */}
        <div className="w-20 h-20 mx-auto text-gray-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;