import React from 'react';

interface SubmitButtonProps {
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
  return (
    <button
      type="submit"
      className="
        group
        shadow-[inset_0_0_0_2px_#4A4A4A] rounded-3xl
        tracking-widest uppercase
        hover:bg-main-black hover:text-main-white
        transition duration-300
        px-20 md:px-32 py-4 my-10"
    >
      <p className="group-hover:text-main-white font-bold transition duration-300 bg-transparent">{children}</p>
    </button>
  );
};

export default SubmitButton;
