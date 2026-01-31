const ProgressBar = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-[#e15f0b] to-[#d14a00] h-2 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
