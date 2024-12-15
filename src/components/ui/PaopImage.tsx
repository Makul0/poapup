// src/components/ui/PoapImage.tsx
import Image from 'next/image'

interface PoapImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  size?: number
}

export function PoapImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  size = 400
}: PoapImageProps) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '1/1' }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover rounded-lg"
        sizes={`(max-width: 768px) ${size}px, ${size}px`}
      />
    </div>
  )
}