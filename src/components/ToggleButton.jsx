import React, { useState } from 'react';

const ToggleButton = ({ onChange }) => {
  const [isInPerson, setIsInPerson] = useState(false);

  const toggleButton = () => {
    setIsInPerson(!isInPerson);
    onChange(!isInPerson);  // Call the passed onChange function with the new state
  };

  return (
    <div className="relative self-center dark:bg-white p-1 flex rounded-full text-sm bg-neutral-50 drop-shadow-sm border-[1px] border-[#F1F1F1] shadow-2 dark:bg-dark-2 z-10">
      <button
        type="button"
        className={`relative w-48 h-12 rounded-full shadow-sm py-1 md:px-5 text-xl Gilroy-SemiBold ${
          !isInPerson
            ? "bg-cyan-700 text-white"
            : "bg-transparent text-neutral-900 dark:text-gray-700"
        }`}
        onClick={toggleButton}
      >
        In Person
      </button>
      <button
        type="button"
        className={`relative w-48 h-12 rounded-full py-1 md:px-5 text-xl Gilroy-SemiBold ${
          isInPerson
            ? "bg-cyan-700 text-white"
            : "bg-transparent text-neutral-900 dark:text-gray-700"
        }`}
        onClick={toggleButton}
      >
        Virtual
      </button>
    </div>
  );
};

export default ToggleButton;