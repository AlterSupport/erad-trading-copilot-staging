interface CircularLoaderProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export default function CircularLoader({
  size = 48,
  strokeWidth = 4,
  className = '',
}: CircularLoaderProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className='animate-spin'
      >
        <defs>
          <linearGradient
            id='loader-gradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor='currentColor' stopOpacity='1' />
            <stop offset='100%' stopColor='currentColor' stopOpacity='0.1' />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='url(#loader-gradient)'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={strokeDasharray}
          fill='none'
          className='origin-center'
        />
      </svg>
    </div>
  )
}
