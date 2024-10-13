import React from 'react';
import ToggleSwitchProps from './interface/ToggleProps';

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, disabled }) => {
  // Handle the checkbox change event and pass the correct type
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <label className="tw-flex tw-cursor-pointer tw-select-none tw-items-center">
      <div className="tw-relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleCheckboxChange}
          className="tw-sr-only"
        />
        <div className={`tw-block tw-h-8 tw-w-14 tw-rounded-full ${checked ? 'tw-bg-blue-500' : 'tw-bg-gray-300'}`}></div>
        <div
          className={`tw-absolute tw-left-1 tw-top-1 tw-h-6 tw-w-6 tw-rounded-full tw-bg-white tw-transition-transform ${checked ? 'tw-transform tw-translate-x-6' : ''}`}
        ></div>
      </div>
      {label && <span className="tw-ml-3 tw-text-sm tw-font-medium">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;
