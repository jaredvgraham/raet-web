interface DotsProps {
  totalSlides: number;
  activeIndex: number;
}

const Dots = ({ totalSlides, activeIndex }: DotsProps) => {
  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={`w-4 h-4 mx-1 rounded-full ${
            index === activeIndex ? "bg-gray-400 " : "bg-gray-300 opacity-35"
          }`}
        />
      ))}
    </div>
  );
};

export default Dots;
