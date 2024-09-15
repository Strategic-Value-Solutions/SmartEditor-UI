import { useEditor } from '@/components/Editor/CanvasContext'
import { tools } from '@/constants'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

function ExtendedToolbar(
  {
    // canvas,
    // showExtendedToolbar,
    // createRect,
    // fileReaderInfo,
    // toggleExtendedToolbar,
  }: any
) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )
  const { currentProjectModel: pick } = useSelector(
    (state: RootState) => state.projectModels
  )
  const editor = useEditor() as any

  return (
    <div
      className={`grid grid-cols-2 items-center justify-center gap-3 fixed z-50 bg-gradient-to-br border bg-gray-100 border-gray-300 w-24 p-1 transition-all duration-300 left-0 top-0 h-full`}
      id='toolbar'
    >
      {tools.map((button: any, index: any) => {
        if (pick?.pickModel?.name === button.pickName) {
          return (
            <button
              key={`${index}-primary`}
              type='button'
              className='p-2 hover:bg-gray-200 rounded invert'
              title={button.title}
              onClick={() => editor.addIcon(button.imgSrc)}
              style={{
                filter: 'invert(0)', // Ensure icons aren't too light
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle shadow
              }}
            >
              <img
                src={button.imgSrc}
                alt={button?.title?.toLowerCase()}
                className='max-w-full' // Ensure full visibility
                style={{
                  filter: 'contrast(1.2)', // Increase contrast for clarity
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
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
              className='p-2 hover:bg-gray-300 rounded invert'
              title={`${button.title} (Alternative)`}
              onClick={() =>
                editor.addIcon(button.imgSrc, { variant: 'secondary' })
              }
              style={{
                filter: 'invert(0)',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              <img
                src={button.imgSrc}
                alt={`${button?.title?.toLowerCase()} (alt)`}
                className='max-w-full'
                style={{
                  filter: 'contrast(1.2)',
                }}
              />
            </button>
          )
        }
      })}
      {/* Continue similarly for other buttons */}
    </div>
  )
}

export default ExtendedToolbar
