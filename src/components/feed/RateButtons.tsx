import React from "react";

type RatingButtonsProps = {
  rate: number | null;
  setRate: (rate: number) => void;
  isCurrentCard: boolean;
};

const RatingButtons = ({
  rate,
  setRate,
  isCurrentCard,
}: RatingButtonsProps) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div
      className="flex justify-between bg-black p-3 rounded-b-2xl"
      style={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
    >
      {numbers.map((number) => (
        <button
          key={number}
          className={`p-2 min-w-[30px] rounded-lg text-center ${
            rate === number && isCurrentCard
              ? "bg-teal-300 text-white"
              : "bg-white text-gray-800"
          }`}
          onClick={() => setRate(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default RatingButtons;
