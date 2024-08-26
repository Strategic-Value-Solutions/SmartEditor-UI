import { useEditor } from '@/components/new-editor/CanvasContext'
import { tools } from '@/constants'
import imageConstants from '@/constants/imageConstants'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

function ExtendedToolbar({
  canvas,
  showExtendedToolbar,
  createRect,
  fileReaderInfo,
  toggleExtendedToolbar,
}: any) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )
  const { currentProjectModel: pick } = useSelector(
    (state: RootState) => state.projectModels
  )
  const editor = useEditor() as any
  if (!pick?.isActive) return null

  return (
    <div
      className={`grid grid-cols-2 items-center justify-center gap-3 fixed z-50 bg-gradient-to-br from-gray-100 to-gray-400 rounded-lg shadow-lg w-24 p-1 transition-all duration-300 ${
        isCollapsed ? 'left-24 top-24' : 'left-64 top-24'
      }`}
    >
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={index}
              type='button'
              className='p-2 hover:bg-white rounded'
              title={button.title}
              onClick={() => editor.addIcon(button.imgSrc)}
            >
              <img src={button.imgSrc} alt={button?.title?.toLowerCase()} />
            </button>
          )
        }
      })}
      <button
        type='button'
        onClick={() => toggleExtendedToolbar()}
        className='p-2 hover:bg-white  rounded'
      >
        <img src={imageConstants.close} alt='close' />
      </button>
    </div>
  )
}

export default ExtendedToolbar
