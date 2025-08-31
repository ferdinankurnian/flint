import React from "react";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked,
  onChange,
  id,
}) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked || false,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked;
    if (!isControlled) setInternalChecked(newState);
    onChange?.(newState);
  };

  const inputChecked = isControlled ? checked! : internalChecked;

  return (
    <label className="inline-flex items-center cursor-pointer" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={inputChecked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
      />
      <div
        className={`
          w-11 h-6
          ${inputChecked ? "bg-blue-600" : "bg-neutral-600"}
          rounded-full transition-colors duration-200
          relative peer-checked:bg-blue-600
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:w-5 after:h-5 after:bg-white after:rounded-full
          after:transition-transform after:duration-200
          peer-checked:after:translate-x-full
        `}
      />
    </label>
  );
};
