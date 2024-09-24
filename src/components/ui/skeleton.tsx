const SkeletonProjectModelCard = () => {
  return (
    <div
      className='relative border rounded-md p-2 border-gray-300 bg-white dark:bg-gray-500 dark:border-gray-700'
      style={{ marginBottom: '0.5rem' }}
    >
      {/* Thumbnail skeleton */}
      <div className='flex justify-center items-center h-32 bg-gray-100'>
        <div className='w-20 h-20 bg-gray-300 animate-pulse rounded flex items-center justify-center'>
          <span className='text-gray-400 text-xs'>Loading...</span>
        </div>
      </div>

      {/* Title skeleton */}
      <div className='mt-2 h-5 bg-gray-300 rounded-md w-3/4 animate-pulse'></div>

      {/* Status capsule and action buttons skeleton */}
      <div className='mt-1 flex items-center justify-between gap-1'>
        <div className='h-6 w-20 bg-gray-300 rounded-full animate-pulse'></div>
        <div className='flex gap-1'>
          <div className='h-6 w-6 bg-gray-300 rounded-full animate-pulse'></div>
          <div className='h-6 w-6 bg-gray-300 rounded-full animate-pulse'></div>
          <div className='h-6 w-6 bg-gray-300 rounded-full animate-pulse'></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonProjectModelCard
