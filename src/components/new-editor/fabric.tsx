import { CanvasProvider } from './CanvasContext'
import Editor from './Editor'

export default function WhiteBoard() {
  return (
    <CanvasProvider>
      <Editor />
    </CanvasProvider>
  )
}
