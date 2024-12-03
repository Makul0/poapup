export function LoadingSpinner({ 
    className = "h-12 w-12",
    center = true 
  }: {
    className?: string
    center?: boolean
  }) {
    const spinner = (
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${className}`} />
    )
  
    if (center) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          {spinner}
        </div>
      )
    }
  
    return spinner
  }