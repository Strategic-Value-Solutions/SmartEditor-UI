import { CanvasProvider } from './CanvasContext/CanvasContext'
import Editor from './Editor'

export default function WhiteBoard() {
  return (
    <CanvasProvider>
      <Editor />
    </CanvasProvider>
  )
}
