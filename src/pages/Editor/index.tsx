import Whiteboard from '@/components/WhiteBoard/index.tsx'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useCallback, useState } from 'react'

const Editor = () => {
  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: '',
  })

  const updateFileReaderInfo = useCallback((data: any) => {
    setFileReaderInfo((prev) => ({ ...prev, ...data }))
  }, [])

  const onClickNextPage = () => {
    if (
      fileReaderInfo.totalPages &&
      fileReaderInfo.currentPageNumber < fileReaderInfo.totalPages
    ) {
      updateFileReaderInfo({
        currentPageNumber: fileReaderInfo.currentPageNumber + 1,
      })
    }
  }

  const onClickPreviousPage = () => {
    if (fileReaderInfo.currentPageNumber > 1) {
      updateFileReaderInfo({
        currentPageNumber: fileReaderInfo.currentPageNumber - 1,
      })
    }
  }

  return (
    <div className='flex h-screen flex-col'>
      <div className='relative flex flex-grow'>
        <div
          className={`absolute top-1/2 z-10 -translate-y-1/2 transform pl-8`}
        >
          <button
            onClick={onClickPreviousPage}
            className='rounded-full bg-gray-500 p-2 text-white hover:bg-gray-400 disabled:bg-gray-300'
          >
            <ChevronLeftIcon />
          </button>
        </div>
        <div className={`flex-grow overflow-auto`}>
          <Whiteboard
            aspectRatio={16 / 8.5}
            fileReaderInfo={fileReaderInfo}
            updateFileReaderInfo={updateFileReaderInfo}
          />
        </div>
        <div
          className={`absolute top-1/2 z-10 -translate-y-1/2  transform pl-2`}
        >
          <button
            onClick={onClickNextPage}
            className='rounded-full bg-gray-500 p-2 text-white hover:bg-gray-400 disabled:bg-gray-300'
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Editor
