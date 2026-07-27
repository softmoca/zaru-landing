interface Props {
  size?: number;
  className?: string;
}

/** 자루 심볼 — 입구를 묶은 자루 + 안에 담긴 체크(완료).
 *  장식 요소라 aria-hidden. 의미는 옆의 텍스트가 전달한다. */
export function ZaruMark({ size = 26, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7.4 8.7h9.2a4 4 0 0 1 3.92 4.8l-.95 4.5A4 4 0 0 1 15.65 21.2H8.35a4 4 0 0 1-3.92-3.2l-.95-4.5A4 4 0 0 1 7.4 8.7Z"
        fill="currentColor"
      />
      <path
        d="M8.7 8.7c0-2.5 1.45-3.9 3.3-3.9s3.3 1.4 3.3 3.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m9.6 14.6 1.9 1.9 3.5-3.6"
        stroke="var(--cream)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
