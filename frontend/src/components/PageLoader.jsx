const PageLoader = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 backdrop-blur-sm flex items-center justify-center z-20">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
