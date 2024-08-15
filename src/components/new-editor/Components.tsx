// @ts-nocheck
import {
  Ban,
  Braces,
  Circle,
  Delete,
  Download,
  Eye,
  EyeOff,
  Image,
  Square,
  TypeOutline,
} from 'lucide-react'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { useEditor } from './CanvasContext'
import ExtendedToolbar from '../WhiteBoard/components/ExtendedToolbar'
import { tools } from '@/constants/constants'
import imageConstants from '@/constants/imageConstants'

export default function Components() {
  const editor = useEditor()

  const [openColor, setOpenColor] = React.useState(false)
  const [openBorderColor, setOpenBorderColor] = React.useState(false)
  const [openStroke, setOpenStroke] = React.useState(false)
  const [openExporter, setOpenExporter] = React.useState(false)

  return (
    <div className={`flex flex-col items-center justify-center gap-8 p-2 fixed right-10 bottom-10 z-50`}>
      {/* {tools.map((button, index) => {
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  type='button'
                  title={button.title}
                  onClick={() => editor.addIcon(button.imgSrc)}
                >
                  <img src={button.imgSrc} alt={button.title} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })} */}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className='cursor-pointer text-[1.3rem]'
              onClick={() => editor.moveMode()}
            >
              Move
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Square
              className='cursor-pointer text-[1.3rem]'
              onClick={() => editor.addRect()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Square</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Circle
              className='cursor-pointer'
              onClick={() => editor.addCircle()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Circle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <TypeOutline
              className='cursor-pointer text-[1.5rem] md:text-[1.8rem]'
              onClick={() => editor.addText()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Text</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <label htmlFor='img-input'>
                <Image className='cursor-pointer text-[1.5rem] md:text-[1.8rem]' />
              </label>
              <input
                type='file'
                id='img-input'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={(e) => editor.addImage(e, editor.canvas)}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Delete
              className='cursor-pointer text-[1.5rem] md:text-[1.8rem]'
              onClick={() => editor.deleteBtn()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Ban
              className='cursor-pointer text-[1.5rem] md:text-[1.8rem]'
              onClick={() => editor.canvas.clear()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear canvas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Download
              className='cursor-pointer text-[1.5rem] md:text-[1.8rem]'
              onClick={() => editor.downloadPage()}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Download</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {editor.hideCanvas ? (
              <EyeOff className='cursor-pointer text-[1.5rem] md:text-[1.8rem]' />
            ) : (
              <Eye className='cursor-pointer text-[1.5rem] md:text-[1.8rem]' />
            )}
          </TooltipTrigger>
          <TooltipContent>{editor.hideCanvas ? 'Hide' : 'Show'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Braces
              className='cursor-pointer text-[1.5rem] md:text-[1.8rem]'
              onClick={() => editor.downloadJSON()}
            />
          </TooltipTrigger>
          <TooltipContent>Download JSON</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
