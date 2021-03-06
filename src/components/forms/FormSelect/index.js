import React from "react";
import "./styles.scss";

const FormSelect = ({
  options,
  defaultValue,
  handleChange,
  label,
  placeholder,
  ...otherProps
}) => {
  if (!Array.isArray(options) || options.length < 1) return null;

  return (
    <div className="formRow">
      {label && <label>{label}</label>}

      <select
        className="formSelect"
        value={defaultValue}
        onChange={handleChange}
        {...otherProps}
      >
        <option disabled selected>
          {placeholder}
        </option>
        {options.map((option, index) => {
          const { value, name } = option;
          return (
            <option key={index} value={value}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormSelect;
