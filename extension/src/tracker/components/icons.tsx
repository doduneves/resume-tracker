type IconProps = {
  size?: number;
};

export function DetailsIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M2 2h7v2H4v8h8V9h2v5H2zm8 0h4v4h-1.5V4.56L8.78 8.28 7.72 7.22l3.72-3.72H10z"
      />
    </svg>
  );
}

export function DeleteIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6 2h4l1 1h3v1.5H2V3h3zm-.5 3h1.5v8H5.5zm3 0H10v8H8.5zM4 5h8l-.6 8.2A1 1 0 0 1 10.4 14H5.6A1 1 0 0 1 4.6 13.2z"
      />
    </svg>
  );
}

export function PlusIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7 3h2v4h4v2H9v4H7V9H3V7h4z"
      />
    </svg>
  );
}
