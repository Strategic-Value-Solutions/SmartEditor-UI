import { CanvasProvider } from './CanvasContext'
import FileUpload from './FileUpload'

export default function WhiteBoard() {
  return (
    <CanvasProvider>
      <FileUpload />
    </CanvasProvider>
  )
}
