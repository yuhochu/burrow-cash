import React from "react";

interface IButtonProps {
  children: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  [property: string]: any;
}

export function YellowSolidButton(props: IButtonProps) {
  return <Button appearanceClass="bg-primary text-dark-200 cursor-pointer" {...props} />;
}
export function YellowLineButton(props: IButtonProps) {
  return (
    <Button
      appearanceClass="bg-primary bg-opacity-5 text-primary cursor-pointer border border-primary border-opacity-60"
      {...props}
    />
  );
}
export function RedSolidButton(props: IButtonProps) {
  return <Button appearanceClass="bg-red-50 text-white cursor-pointer" {...props} />;
}
export function RedLineButton(props: IButtonProps) {
  return (
    <Button
      appearanceClass="bg-red-50 bg-opacity-5 text-red-50 cursor-pointer border border-red-50 border-opacity-60"
      {...props}
    />
  );
}

function Button({ appearanceClass, children, disabled, className, ...rest }: IButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      disabled={disabled}
      className={`h-[42px] rounded-md text-base font-bold px-6 hover:opacity-80 outline-none ${
        disabled
          ? " bg-gray-500 bg-opacity-30 text-dark-400 cursor-not-allowed"
          : `${appearanceClass}`
      } ${className}`}
    >
      {children}
    </button>
  );
}
