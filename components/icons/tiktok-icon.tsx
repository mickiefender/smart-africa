import * as React from "react"

interface TikTokIconProps extends React.SVGProps<SVGSVGElement> {}

export default function TikTokIcon(props: TikTokIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Stylized TikTok note */}
      <path d="M9 3v12.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M15 3a5 5 0 0 0 5 5" />
      <path d="M15 8.5v7a3.5 3.5 0 1 1-3.5-3.5" />
    </svg>
  )
}
