const Loader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white  z-50'>
      <div className='flex flex-row gap-2'>
        <div
          className='w-4 h-4 rounded-full bg-blue-700'
          style={{
            animation: 'bounceMore 1s infinite',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          }}
        ></div>
        <div
          className='w-4 h-4 rounded-full bg-blue-700'
          style={{
            animation: 'bounceMore 1s infinite',
            animationDelay: '-0.3s',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          }}
        ></div>
        <div
          className='w-4 h-4 rounded-full bg-blue-700'
          style={{
            animation: 'bounceMore 1s infinite',
            animationDelay: '-0.5s',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          }}
        ></div>
      </div>
      <style>{`
        @keyframes bounceMore {
          0%,
          100% {
            transform: translateY(-50%);
          }
          50% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Loader
