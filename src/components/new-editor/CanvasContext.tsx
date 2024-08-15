// @ts-nocheck
import * as fabric from 'fabric'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const editorFunctions = React.createContext()

export const useEditor = () => {
  return React.useContext(editorFunctions)
}

export const CanvasProvider = ({ children }) => {
  const [currPage, setCurrPage] = React.useState(1)
  const [numPages, setNumPages] = React.useState(null)
  const [selectedFile, setFile] = React.useState(null)
  const [isExporting, setExporting] = React.useState(false)
  const [hideCanvas, setHiddenCanvas] = React.useState(false)
  const [canvas, setCanvas] = React.useState<fabric.Canvas>(null)
  const [borderColor] = React.useState('#f4a261')
  const [color] = React.useState('#f4a261')
  const [mode, setMode] = React.useState('select') // Modes: 'create-rect', 'create-circle', 'create-text', 'select', 'erase', 'addIcon'
  const [activeIcon, setActiveIcon] = React.useState(null)
  const activeIconRef = useRef(activeIcon) // Use ref to hold the current active icon
  const exportPage = useRef(null)
  const [exportPages, setExportPages] = React.useState([])

  const [edits, setEdits] = React.useState({}) // { 1: <page1_json>, 2: <page2_json>, ... }

  // Sync the activeIconRef with the activeIcon state
  React.useEffect(() => {
    activeIconRef.current = activeIcon
  }, [activeIcon])

  // Save the current canvas state before switching pages
  const saveCanvasState = (pageNumber) => {
    if (canvas) {
      const canvasJson = canvas.toJSON()
      setEdits((prevEdits) => ({
        ...prevEdits,
        [pageNumber]: canvasJson,
      }))
    }
  }

  // Load the canvas state when a new page is selected
  const loadCanvasState = (pageNumber) => {
    const canvasJson = edits[pageNumber]
    if (canvas && canvasJson) {
      canvas.loadFromJSON(canvasJson, () => {
        canvas.renderAll()
      })
    }
  }

  // Handle canvas interactions based on mode
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
        selectable: false, // Disable selection by default
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
        selectable: false, // Disable selection by default
      })
      canvas.add(circle)
    } else if (mode === 'create-text') {
      const text = new fabric.Textbox('Type Here ...', {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontFamily: 'roboto',
        selectable: false, // Disable selection by default
      })
      canvas.add(text)
    } else if (mode === 'erase') {
      const activeObject = canvas.getActiveObject()
      if (activeObject) {
        canvas.remove(activeObject)
      }
    } else if (mode === 'addIcon' && activeIconRef.current) {
      const pointer = canvas.getPointer(event.e)
      // Create a new Image element for each click
      const imgElement = document.createElement('img')
      imgElement.crossOrigin = 'anonymous' // Handle cross-origin if necessary

      imgElement.onload = function () {
        // Create a fabric.Image from the loaded Image element
        const img = new fabric.Image(imgElement, {
          left: pointer.x,
          top: pointer.y,
          selectable: false,
          scaleX: 1,
          scaleY: 1,
        })
        // Add the new image to the canvas
        canvas.add(img)
        canvas.renderAll()
      }

      imgElement.onerror = function (error) {
        console.error('Error loading image:', error)
      }

      // Set the source of the image element after everything is set up
      imgElement.src = activeIconRef.current

      // Force the image element to update with a new src
      imgElement.src = activeIconRef.current + '?_=' + new Date().getTime()
    }

    // Re-render the canvas
    canvas.renderAll()
  }

  React.useEffect(() => {
    if (document.getElementById('canvasWrapper'))
      document.getElementById('canvasWrapper').style.visibility =
        document.getElementById('canvasWrapper').style.visibility == 'hidden'
          ? 'visible'
          : 'hidden'
  }, [hideCanvas])

  React.useEffect(() => {
    if (!canvas) return

    if (mode.startsWith('create')) {
      // Disable selection in create modes
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.off('mouse:down', handleCanvasClick)
      canvas.on('mouse:down', handleCanvasClick)
    } else if (mode === 'select' || mode === 'move') {
      // Enable selection in select/move modes
      canvas.selection = true
      canvas.forEachObject((obj) => (obj.selectable = true))
      canvas.off('mouse:down', handleCanvasClick) // Disable creating shapes in select/move mode
    } else if (mode === 'erase') {
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.on('mouse:down', (event) => {
        const activeObject = canvas.getActiveObject()
        if (activeObject) {
          canvas.remove(activeObject)
        }
      })
    } else if (mode === 'addIcon') {
      // This mode will allow adding icons when the canvas is clicked
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.off('mouse:down', handleCanvasClick)
      canvas.on('mouse:down', handleCanvasClick)
    }

    canvas.renderAll()
  }, [canvas, mode])

  // Handle page change - save the current page's state and load the new one
  React.useEffect(() => {
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

  const deleteBtn = () => {
    if (mode === 'select' || mode === 'move') {
      var activeObject = canvas.getActiveObject()
      if (activeObject) {
        canvas.remove(activeObject)
      }
    }
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

  const eraseMode = () => {
    setMode('erase')
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
        addImage,
        selectMode, // Function to switch to select mode
        moveMode, // Function to switch to move mode
        eraseMode, // Function to switch to erase mode
        numPages,
        setNumPages,
        currPage,
        setCurrPage,
        selectedFile,
        setFile,
        edits,
        setEdits,
        deleteBtn,
        exportPage,
        exportPdf,
        downloadPage,
        isExporting,
        hideCanvas,
        setHiddenCanvas,
        downloadJSON,
        loadNewPDF, // Function to load new PDF
      }}
    >
      {children}
    </editorFunctions.Provider>
  )
}
