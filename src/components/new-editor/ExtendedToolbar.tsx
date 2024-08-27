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
      className={`grid grid-cols-2 items-center justify-center gap-3 fixed z-50 bg-gradient-to-br border bg-blue-950 border-gray-400 h-[80vh] rounded-lg invert-lg w-24 p-1 transition-all duration-300 ${
        isCollapsed ? 'left-24 top-24' : 'left-64 top-24'
      }`}
      id="toolbar"
    >
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-primary`}
              type='button'
              className='p-2 hover:bg-white rounded invert'
              title={button.title}
              onClick={() => editor.addIcon(button.imgSrc)}
            >
              <img src={button.imgSrc} alt={button?.title?.toLowerCase()} />
            </button>
          )
        }
      })}
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-secondary`}
              type='button'
              className='p-2 hover:bg-blue-100 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
              />
            </button>
          )
        }
      })}
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-tertiary`}
              type='button'
              className='p-2 hover:bg-green-100 rounded invert'
              title={`${button.title} (Special)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'special' })
              }
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (special)`}
              />
            </button>
          )
        }
      })}
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-tertiary`}
              type='button'
              className='p-2 hover:bg-green-100 rounded invert'
              title={`${button.title} (Special)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'special' })
              }
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (special)`}
              />
            </button>
          )
        }
      })}
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-tertiary`}
              type='button'
              className='p-2 hover:bg-green-100 rounded invert'
              title={`${button.title} (Special)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'special' })
              }
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (special)`}
              />
            </button>
          )
        }
      })}
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-tertiary`}
              type='button'
              className='p-2 hover:bg-green-100 rounded invert'
              title={`${button.title} (Special)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'special' })
              }
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (special)`}
              />
            </button>
          )
        }
      })}
      
      <button
        type='button'
        onClick={() => toggleExtendedToolbar()}
        className='p-2 hover:bg-white  rounded invert'
      >
        <img src={imageConstants.close} alt='close' />
      </button>
    </div>
  )
}

export default ExtendedToolbar
