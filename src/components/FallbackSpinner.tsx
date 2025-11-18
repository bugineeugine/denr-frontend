const FallbackSpinner = () => {
  return (
    <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-40 w-32 h-32 bg-blue-300 rounded-full opacity-25 animate-bounce"></div>
        <div
          className="absolute bottom-20 right-20 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-16 h-16 bg-blue-400 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-32 right-10 w-28 h-28 bg-blue-300 rounded-full opacity-25 animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main loading container */}
      <div className="relative z-10 text-center px-8 max-w-lg w-full">
        {/* Multiple spinning circles */}
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 w-20 h-20 border-4 border-white border-opacity-30 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin opacity-70"
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
            ></div>
            <div
              className="absolute inset-4 w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin"
              style={{ animationDuration: "2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackSpinner;
