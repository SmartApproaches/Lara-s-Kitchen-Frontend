const ProgressTracker = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex gap-4 mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-green-600 transition-all duration-300 ease-in-out rounded-full"
            style={{
              width: index <= currentStep ? "100%" : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};
export default ProgressTracker;
