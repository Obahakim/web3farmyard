'use client'

interface Props {
  src: string
  alt: string
  size?: number
  fallback?: string
  className?: string
  padding?: number
}

export default function ChainLogo({ src, alt, size = 36, fallback, className = '', padding = 4 }: Props) {
  const ini = (alt || '?').split(' ').map((w: string) => w[0] || '').join('').slice(0, 2).toUpperCase()
  
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', padding, display: 'block' }}
      onError={(e) => {
        const img = e.target as HTMLImageElement
        img.style.display = 'none'
        if (img.parentElement) {
          img.parentElement.innerHTML = fallback ||
            `<span style="font-family:'Space Mono',monospace;font-size:${Math.floor(size/3)}px;font-weight:700;color:#666">${ini}</span>`
        }
      }}
    />
  )
}
