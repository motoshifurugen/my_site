import React from 'react';
import Chip from '../atoms/Chip';

interface InputLabelProps {
  label: string;
  id: string;
  required?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({ label, id, required = false }) => {
  return (
    <label htmlFor={id} className="block text-sm md:text-md font-bold mb-2">
      <p>
        {label}
        {required && (
          <Chip className="bg-red-500 text-white">
            必須
          </Chip>
        )}
      </p>
    </label>
  );
};

export default InputLabel;
