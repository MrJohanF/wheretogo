import React from 'react';

/**
 * @typedef {Object} ToggleSwitchProps
 * @property {string} [id="toggle"] - Unique identifier for the toggle input
 * @property {string} [name="toggle"] - Name attribute for the toggle input
 * @property {boolean} checked - Whether the toggle is checked/active
 * @property {function(boolean): void} onChange - Function called when the toggle state changes
 * @property {string} [enabledText="Activado"] - Text shown when toggle is enabled
 * @property {string} [disabledText="Desactivado"] - Text shown when toggle is disabled
 * @property {string} [ariaLabel="Toggle switch"] - Accessible label for the toggle
 * @property {string} [className=""] - Additional CSS classes to apply to the toggle container
 */

/**
 * Toggle Switch Component
 * 
 * A customizable toggle switch with enabled/disabled states
 * and support for dark mode.
 * 
 * @param {ToggleSwitchProps} props - Component props
 * @returns {React.JSX.Element} Toggle switch component
 */
const ToggleSwitch = ({
  id = "toggle",
  name = "toggle",
  checked,
  onChange,
  enabledText = "Activado",
  disabledText = "Desactivado",
  ariaLabel = "Toggle switch",
  className = "",
}) => {
  return (
    <label
      className={`inline-flex relative items-center cursor-pointer py-1 group ${className}`}
      htmlFor={id}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-label={ariaLabel}
        role="switch"
        aria-checked={checked}
      />
      <div
        className={`
          w-12 h-6 rounded-full relative
          bg-gray-200 dark:bg-gray-700
          group-hover:bg-gray-300 dark:group-hover:bg-gray-600
          peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500
          group-hover:peer-checked:bg-indigo-500 dark:group-hover:peer-checked:bg-indigo-400
          peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 
          dark:peer-focus-visible:ring-indigo-400 peer-focus-visible:ring-offset-2
          transition-colors duration-300 ease-in-out
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
          after:bg-white after:border-gray-300 after:border dark:after:border-gray-600
          after:rounded-full after:h-5 after:w-5 after:shadow-md
          after:transition-all after:duration-300 after:ease-in-out
          peer-checked:after:translate-x-6 peer-checked:after:border-white
        `}
      >
        {/* Status indicators */}
        <span className="flex justify-between px-1.5 py-1.5">
          <span className="h-2 w-2 rounded-full bg-white/30 opacity-0 peer-checked:opacity-100 transition-opacity"></span>
          <span className="h-2 w-2 rounded-full bg-gray-400/30 opacity-0 peer-not-checked:opacity-100 transition-opacity"></span>
        </span>
      </div>
      <span
        className={`
          ml-3 text-sm font-medium w-[85px]
          ${checked 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-700 dark:text-gray-300'
          }
          transition-colors duration-200
        `}
      >
        {checked ? enabledText : disabledText}
      </span>
    </label>
  );
};

export default ToggleSwitch;