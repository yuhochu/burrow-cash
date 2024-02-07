function CheckedIcon(props: any) {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="4" fill="#D2FF3A" />
      <path
        d="M4 8.22222L6.85714 11L12 6"
        stroke="#14162B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnCheckedIcon(props) {
  return (
    <svg
      {...props}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="#23253A" stroke="#D2FF3A" />
    </svg>
  );
}

export function CheckBoxCustom({
  checked,
  onClick,
  className,
}: {
  checked: boolean;
  onClick: any;
  className: string;
}) {
  return checked ? (
    <CheckedIcon onClick={onClick} className={className} />
  ) : (
    <UnCheckedIcon onClick={onClick} className={className} />
  );
}
