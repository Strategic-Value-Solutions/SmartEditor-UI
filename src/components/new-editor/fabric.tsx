import FileUpload from './FileUpload'
import { CanvasProvider } from './CanvasContext'

export default function WhiteBoard() {
  return (
    <CanvasProvider>
      <FileUpload />
    </CanvasProvider>
  )
}
