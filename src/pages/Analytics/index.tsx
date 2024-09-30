import React from 'react'

const ChartLayout = () => {
  return (
    <div className='container mx-auto p-4'>
      {/* Page Title */}
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold'>Dashboard Overview</h1>
      </div>

      {/* Grid layout for charts */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {/* Chart 1 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 1: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            {/* Example placeholder */}
            <p className='text-gray-500'>Chart Component 1</p>
          </div>
        </div>

        {/* Chart 2 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 2: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>Chart Component 2</p>
          </div>
        </div>

        {/* Chart 3 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 3: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>Chart Component 3</p>
          </div>
        </div>

        {/* Chart 4 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 4: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>Chart Component 4</p>
          </div>
        </div>

        {/* Chart 5 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 5: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>Chart Component 5</p>
          </div>
        </div>

        {/* Chart 6 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='font-semibold text-lg mb-4'>Chart 6: Example</h2>
          {/* Place your chart component here */}
          <div className='h-64 flex items-center justify-center bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>Chart Component 6</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartLayout
