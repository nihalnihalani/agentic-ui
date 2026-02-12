import { cn } from "@/lib/utils";

interface CopilotKitIconProps {
  className?: string;
}

/** The CopilotKit kite/paper-airplane icon mark extracted from the official logo. */
export function CopilotKitIcon({ className }: CopilotKitIconProps) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
    >
      <path
        d="M3.814 11.314C6.457 7.857 8.651 4.439 9.494 1.679C9.517 1.603 9.605 1.571 9.671 1.615C12.605 3.558 17.951 4.837 22.678 4.867C22.76 4.868 22.816 4.948 22.786 5.024C21.215 9.012 19.294 16.158 19.221 24.319C19.22 24.44 19.05 24.483 18.99 24.378C16.298 19.669 7.68 13.053 3.859 11.491C3.788 11.462 3.767 11.375 3.814 11.314Z"
        fill="url(#ck_paint0)"
      />
      <path
        d="M12.73 9.2C8.601 10.508 4.826 11.235 3.924 11.4C3.866 11.41 3.855 11.49 3.909 11.512C7.761 13.113 16.336 19.71 19.001 24.4C19.007 24.41 19.02 24.414 19.03 24.409C19.042 24.404 19.047 24.391 19.042 24.379L12.73 9.2Z"
        fill="url(#ck_paint1)"
      />
      <path
        d="M9.683 1.606C13.218 3.535 17.306 4.401 22.726 4.858C22.761 4.861 22.772 4.906 22.741 4.922C22.047 5.279 18.076 7.3 15.126 8.382C14.336 8.672 13.541 8.941 12.758 9.19C12.741 9.195 12.723 9.187 12.716 9.17L9.601 1.679C9.58 1.629 9.635 1.58 9.683 1.606Z"
        fill="url(#ck_paint2)"
      />
      <path
        d="M9.62 1.721L19.108 24.355"
        stroke="#513C9F"
        strokeWidth="0.23"
        strokeLinecap="round"
      />
      <path
        d="M3.926 11.397C3.926 11.397 9.166 10.456 14.091 8.758C19.017 7.059 22.683 4.979 22.683 4.979"
        stroke="#513C9F"
        strokeWidth="0.23"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="ck_paint0"
          x1="16.05"
          y1="3.37"
          x2="11.441"
          y2="16.045"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6430AB" />
          <stop offset="1" stopColor="#AA89D8" />
        </linearGradient>
        <linearGradient
          id="ck_paint1"
          x1="12.478"
          y1="10.515"
          x2="6.543"
          y2="21.98"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#005DBB" />
          <stop offset="1" stopColor="#3D92E8" />
        </linearGradient>
        <linearGradient
          id="ck_paint2"
          x1="15.126"
          y1="3.37"
          x2="13.34"
          y2="8.959"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1B70C4" />
          <stop offset="1" stopColor="#54A4F2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
