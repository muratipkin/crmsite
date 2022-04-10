import React from "react";

const CustomInput=({title, type="text", value, placeholder, handleChange, handleBlur, min=0, autoFocus=false, disabled=false})=>{
    return(
        <div>
        <label className={"mb-1"}>{title}</label>
        <input
            type={type}
            className="form-control mb-2 rounded-3 border-3 border-primary"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            min={min}
            autoFocus={autoFocus}
            disabled={disabled}
        />
        </div>
    );
};
export default CustomInput;
