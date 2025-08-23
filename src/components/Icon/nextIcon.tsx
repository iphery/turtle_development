import React from "react";

const NextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="w-3 h-3 rtl:rotate-180"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 9 4-4-4-4"
    />
  </svg>
);

export default NextIcon;
