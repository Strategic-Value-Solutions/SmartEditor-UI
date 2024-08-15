// @ts-nocheck
import imageConstants from '@/constants/imageConstants'
import * as fabric from 'fabric'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

const editorFunctions = createContext()

export const useEditor = () => {
  return useContext(editorFunctions)
}

export const CanvasProvider = ({ children }) => {
  const [currPage, setCurrPage] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [selectedFile, setFile] = useState(null)
  const [isExporting, setExporting] = useState(false)
  const [hideCanvas, setHiddenCanvas] = useState(false)
  const [canvas, setCanvas] = useState<fabric.Canvas>(null)
  const [borderColor] = useState('#f4a261')
  const [color] = useState('#f4a261')
  const [mode, setMode] = useState('select')
  const [activeIcon, setActiveIcon] = useState(null)
  const activeIconRef = useRef(activeIcon)
  const exportPage = useRef(null)
  const [exportPages, setExportPages] = useState([])

  const [edits, setEdits] = useState({})

  useEffect(() => {
    activeIconRef.current = activeIcon
  }, [activeIcon])

  const saveCanvasState = (pageNumber) => {
    if (canvas) {
      const canvasJson = canvas.toJSON()
      setEdits((prevEdits) => ({
        ...prevEdits,
        [pageNumber]: canvasJson,
      }))
    }
  }

  const loadCanvasState = (pageNumber) => {
    const canvasJson = edits[pageNumber]
    if (canvas && canvasJson) {
      canvas.loadFromJSON(canvasJson, () => {
        canvas.renderAll()
      })
    }
  }

  console.log(mode)
  const handleCanvasClick = async (event) => {
    if (!canvas) return
    const pointer = canvas.getPointer(event.e)

    if (mode === 'create-rect') {
      const rect = new fabric.Rect({
        height: 50,
        width: 50,
        fill: 'transparent',
        stroke: borderColor,
        left: pointer.x,
        top: pointer.y,
        selectable: false,
      })
      canvas.add(rect)
    } else if (mode === 'create-circle') {
      const circle = new fabric.Circle({
        radius: 50,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: 2,
        left: pointer.x,
        top: pointer.y,
        selectable: false,
      })
      canvas.add(circle)
    } else if (mode === 'create-text') {
      const text = new fabric.Textbox('Type Here ...', {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontFamily: 'roboto',
        selectable: false,
      })
      canvas.add(text)
    } else if (mode === 'erase') {
      removeObject(event)
    } else if (mode === 'addIcon' && activeIconRef.current) {
      const imgElement = document.createElement('img')
      imgElement.crossOrigin = 'anonymous'

      imgElement.onload = function () {
        const img = new fabric.Image(imgElement, {
          left: pointer.x,
          top: pointer.y,
          selectable: false,
          scaleX: 1,
          scaleY: 1,
        })
        canvas.add(img)
        canvas.renderAll()
      }

      imgElement.src = activeIconRef.current
    }

    canvas.renderAll()
  }
  React.useEffect(() => {
    if (document.getElementById('canvasWrapper'))
      document.getElementById('canvasWrapper').style.visibility =
        document.getElementById('canvasWrapper').style.visibility == 'hidden'
          ? 'visible'
          : 'hidden'
  }, [hideCanvas])

  const resetCanvasListeners = () => {
    if (canvas) {
      canvas.off('mouse:down', handleCanvasClick)
      canvas.selection = true
      canvas.forEachObject((obj) => (obj.selectable = true))
    }
  }

  useEffect(() => {
    if (!canvas) return

    resetCanvasListeners()

    if (mode.startsWith('create') || mode === 'addIcon') {
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.on('mouse:down', handleCanvasClick)
    } else if (mode === 'erase') {
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.on('mouse:down', removeObject)
    } else if (mode === 'select' || mode === 'move') {
      canvas.selection = true
      canvas.forEachObject((obj) => (obj.selectable = true))
    }

    canvas.renderAll()

    return () => {
      resetCanvasListeners()
    }
  }, [canvas, mode])

  useEffect(() => {
    if (currPage && canvas) {
      saveCanvasState(currPage)
      loadCanvasState(currPage)
    }
  }, [currPage])

  // Various functionalities for the editor
  const downloadPage = () => {
    setExporting(true)
    canvas.renderAll() // Ensure the canvas is fully rendered

    const doc = document.querySelector('#singlePageExport')
    html2canvas(doc).then((canvasEl) => {
      const imgData = canvasEl.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvasEl.width, canvasEl.height],
      })
      pdf.addImage(imgData, 'PNG', 0, 0)
      pdf.save('edited.pdf')
      setExporting(false)
    })
  }

  const addImage = (e, canvas) => {
    var file = e.target.files[0]
    var reader = new FileReader()
    reader.onload = function (f) {
      var data = f.target.result
      fabric.Image.fromURL(data, function (img) {
        img.scaleToWidth(300)
        canvas.add(img).renderAll()
      })
    }
    reader.readAsDataURL(file)
    canvas.isDrawingMode = false
  }

  const removeObject = (e) => {
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
    }
  }

  const eraseMode = () => {
    setMode('erase')
    canvas.isDrawingMode = false
    canvas.hoverCursor = `url(${imageConstants.removeCursor}) 12 12, auto`
  }

  const addRect = () => {
    setMode('create-rect')
  }

  const addCircle = () => {
    setMode('create-circle')
  }

  const addText = () => {
    setMode('create-text')
  }

  const selectMode = () => {
    setMode('select')
  }

  const moveMode = () => {
    setMode('move')
  }

  let drawInstance = null
  let origX
  let origY = 0
  let mouseDown = false
  const options = {
    currentMode: '',
    currentColor: 'red',
    currentWidth: 1,
    fill: false,
    group: {},
  }

  function stopDrawing() {
    mouseDown = false
  }

  function removeCanvasListener(canvas) {
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
  }

  function startDrawingRect(canvas) {
    return ({ e }) => {
      if (mouseDown) {
        const pointer = canvas.getPointer(e)

        if (pointer.x < origX) {
          drawInstance.set('left', pointer.x)
        }
        if (pointer.y < origY) {
          drawInstance.set('top', pointer.y)
        }
        drawInstance.set({
          width: Math.abs(pointer.x - origX),
          height: Math.abs(pointer.y - origY),
        })
        drawInstance.setCoords()
        canvas.renderAll()
      }
    }
  }

  /* ==== rectangle ==== */
  function createRect(icn) {
    removeCanvasListener(canvas)
    canvas.on('mouse:down', startAddRect(icn))
    canvas.on('mouse:move', startDrawingRect(canvas))
    canvas.on('mouse:up', stopDrawing)

    canvas.selection = false
    canvas.hoverCursor = 'auto'
    canvas.isDrawingMode = false
    canvas.getObjects().forEach((item) => item.set({ selectable: false }))
  }

  const startAddRect = (icn) => {
    return ({ e }) => {
      mouseDown = true

      const pointer = canvas.getPointer(e)
      origX = pointer.x
      origY = pointer.y

      // Add the icon to the canvas
      fabric.Image.fromURL(icn, (img) => {
        img.set({
          left: origX,
          top: origY,
          selectable: false,
          scaleX: 1,
          scaleY: 1,
        })

        img._id = uuidv4() // Set a unique id for the object

        canvas.add(img)
        canvas.renderAll() // Ensure the canvas is updated with the icon
      })

      // Draw the rectangle
      drawInstance = new fabric.Rect({
        stroke: options.currentColor,
        strokeWidth: options.currentWidth,
        fill: options.fill ? options.currentColor : 'transparent',
        left: origX,
        top: origY,
        width: 0,
        height: 0,
        selectable: false,
      })

      drawInstance._id = uuidv4() // Set a unique id for the object

      canvas.add(drawInstance)
    }
  }

  const addIcon = (icon) => {
    setMode('addIcon')
    setActiveIcon(icon)
  }

  const exportPdf = () => {
    setExportPages((prev) => [...prev, exportPage.current])
  }

  const downloadJSON = () => {
    var json = canvas.toJSON()

    var dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', 'data.json')

    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const loadNewPDF = (file) => {
    // Clear the canvas and reset states when loading a new PDF
    if (canvas) {
      canvas.clear()
      canvas.dispose()
      setCanvas(null)
    }
    setFile(file)
    setEdits({})
    setExportPages([])
  }

  return (
    <editorFunctions.Provider
      value={{
        canvas,
        addRect,
        setCanvas,
        addIcon,
        addCircle,
        addText,
        selectMode,
        moveMode,
        eraseMode,
        numPages,
        setNumPages,
        currPage,
        setCurrPage,
        selectedFile,
        setFile,
        edits,
        setEdits,
        exportPage,
        exportPdf,
        downloadPage,
        isExporting,
        hideCanvas,
        setHiddenCanvas,
        downloadJSON,
        loadNewPDF, //
      }}
    >
      {children}
    </editorFunctions.Provider>
  )
}
