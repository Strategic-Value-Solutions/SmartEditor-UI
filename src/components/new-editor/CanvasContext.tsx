// @ts-nocheck
import imageConstants from '@/constants/imageConstants'
import * as fabric from 'fabric'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { degrees, PDFDocument, rgb } from 'pdf-lib'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
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
  const [color] = useState('#000000')
  const [mode, setMode] = useState('select')
  const [activeIcon, setActiveIcon] = useState(null)
  const activeIconRef = useRef(activeIcon)
  const [exportPages, setExportPages] = useState([])
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
  const [edits, setEdits] = useState({})
  const [isSelectFilePDF, setIsSelectFilePDF] = useState(false)

  useEffect(() => {
    activeIconRef.current = activeIcon
    updateCursorStyle()
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
        setTimeout(() => {
          canvas.renderAll()
        }, 100)
      })
    }
  }

  const addPdfDimensions = (dimensions) => {
    if (!dimensions.width || !dimensions.height) {
      toast.error('Invalid dimensions')
      return
    }
    setPdfDimensions(dimensions)
  }

  const handleCanvasClick = async (event) => {
    if (!canvas || mode === 'erase') return
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
      const text = new fabric.Textbox('', {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontFamily: 'roboto',
        selectable: true,
        editable: true, // Make the textbox editable
      })
      canvas.add(text)
      canvas.setActiveObject(text) // Automatically select the text box so the user can start typing
      text.enterEditing() // Put the text box into editing mode
    } else if (mode === 'addIcon' && activeIconRef.current) {
      const pointer = canvas.getPointer(event.e)
      let img // Declare the image variable outside the onload function to avoid adding it twice

      // Load the image immediately
      const imgElement = document.createElement('img')
      imgElement.crossOrigin = 'anonymous'
      imgElement.src = activeIconRef.current

      imgElement.onload = function () {
        img = new fabric.Image(imgElement, {
          left: pointer.x,
          top: pointer.y,
          selectable: false,
          scaleX: 1,
          scaleY: 1,
        })

        // Add the image to the canvas
        canvas.add(img)
      }
      // Draw the rectangle immediately on mouse down
      let rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: 2,
        selectable: false,
      })
      canvas.add(rect)

      const onMouseMove = function (event) {
        const pointerMove = canvas.getPointer(event.e)
        let newLeft = pointer.x
        let newTop = pointer.y

        if (pointerMove.x < pointer.x) {
          newLeft = pointerMove.x
        }

        if (pointerMove.y < pointer.y) {
          newTop = pointerMove.y
        }

        rect.set({
          left: newLeft,
          top: newTop,
          width: Math.abs(pointerMove.x - pointer.x),
          height: Math.abs(pointerMove.y - pointer.y),
        })

        // Adjust the icon's position and size based on the rectangle's position
        if (img) {
          img.set({
            left: newLeft,
            top: newTop,
          })

          img.setCoords()
        }

        rect.setCoords()
        canvas.renderAll()
      }

      const onMouseUp = function () {
        const rectArea = rect.get('width') * rect.get('height')
        const imgArea =
          img.get('scaleX') *
          img.get('width') *
          img.get('scaleY') *
          img.get('height')

        // Check if the rectangle's area is smaller than the icon's area
        if (rectArea < imgArea) {
          toast.error(
            'The rectangle is too small for the icon. Please draw a larger rectangle.'
          )

          // Remove the rectangle and icon from the canvas
          canvas.remove(rect)
          if (img) {
            canvas.remove(img)
          }
          canvas.renderAll()

          // Cleanup event listeners
          canvas.off('mouse:move', onMouseMove)
          canvas.off('mouse:up', onMouseUp)

          return // Exit the function to prevent storing the objects
        }

        // Create a group containing the rectangle and the icon
        const group = new fabric.Group([rect, img], {
          selectable: false,
          hasControls: true,
        })

        // Add the group to the canvas
        canvas.add(group)

        // Remove the separate image and rectangle from the canvas after grouping
        canvas.remove(rect)
        canvas.remove(img)

        // Cleanup event listeners
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:up', onMouseUp)
      }

      // Attach the event listeners
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)
    }

    canvas.renderAll()
  }

  useEffect(() => {
    const canvasWrapper = document.getElementById('canvasWrapper')
    if (canvasWrapper) {
      canvasWrapper.style.visibility = hideCanvas ? 'hidden' : 'visible'
    }
  }, [hideCanvas])

  const resetCanvasListeners = () => {
    if (canvas) {
      canvas.off('mouse:down', handleCanvasClick)
      canvas.off('mouse:down', removeObject)
      canvas.selection = true
      canvas.forEachObject((obj) => (obj.selectable = true))
    }
  }

  const removeObject = (event) => {
    if (mode === 'erase' && canvas) {
      const target = canvas.findTarget(event.e)
      if (target) {
        canvas.remove(target)
        canvas.renderAll()
      }
    }
  }

  const updateCursorStyle = () => {
    if (!canvas) return
    if (mode === 'erase') {
      canvas.defaultCursor = `url(${imageConstants.removeCursor}) 12 12, auto`
      canvas.hoverCursor = `url(${imageConstants.removeCursor}) 12 12, auto`
    }
    // else if (mode === 'addIcon') {
    //   canvas.defaultCursor = `url(${activeIconRef.current}) 12 12, auto`
    // }
    else if (mode === 'select' || mode === 'move') {
      canvas.defaultCursor = `url(${imageConstants.SelectIcon}) 12 12, auto`
    } else {
      canvas.defaultCursor = 'default'
      canvas.hoverCursor = 'pointer'
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

    updateCursorStyle()

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
  }, [currPage, canvas])

  const downloadPageAsImage = () => {
    if (!canvas || !pdfDimensions.width || !pdfDimensions.height) {
      toast.error('Canvas or PDF dimensions are not available.')
      return
    }

    setExporting(true)

    const doc = document.querySelector('#singlePageExport')

    // Use html2canvas to capture the canvas, which includes both PDF content and annotations
    html2canvas(doc, {
      scale: 2, // Improve quality
      useCORS: true,
      allowTaint: true,
    })
      .then((canvasEl) => {
        const imgData = canvasEl.toDataURL('image/png')

        // Create a download link and trigger the download
        const link = document.createElement('a')
        link.href = imgData
        link.download = `annotated_page_${currPage}.png`
        link.click()

        setExporting(false)
      })
      .catch((error) => {
        toast.error('Failed to download the image.')
        setExporting(false)
      })
  }

  // Various functionalities for the editor
  const downloadPageAsPDF = () => {
    if (!canvas || !pdfDimensions.width || !pdfDimensions.height) {
      toast.error('Canvas or PDF dimensions are not available.')
      return
    }

    setExporting(true)

    // Render the canvas to ensure all elements are drawn
    canvas.renderAll()
    const doc = document.querySelector('#singlePageExport')
    // Use html2canvas to capture the canvas, which includes both PDF content and annotations
    html2canvas(doc, {
      scale: 2, // Improve quality
      useCORS: true,
      allowTaint: true,
    })
      .then((canvasEl) => {
        const imgData = canvasEl.toDataURL('image/png')

        // Create a new jsPDF instance with the PDF's dimensions
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [pdfDimensions.width, pdfDimensions.height],
        })

        // Add the captured image to the PDF
        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          pdfDimensions.width,
          pdfDimensions.height
        )

        // Save the PDF with annotations
        pdf.save(`annotated_page_${currPage}.pdf`)

        setExporting(false)
      })
      .catch((error) => {
        toast.error('Failed to download the PDF.')
        setExporting(false)
      })
  }

  const downloadCanvasAsImage = () => {
    if (canvas) {
      // Render the canvas to ensure all elements are drawn
      canvas.renderAll()

      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 2, // Increase the resolution by setting a higher multiplier
      })

      // Create a download link and trigger the download
      const link = document.createElement('a')
      link.href = dataURL
      link.download = `canvas_${currPage}.png`
      link.click()
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = function (f) {
      const data = f.target.result
      fabric.Image.fromURL(data, function (img) {
        img.scaleToWidth(300)
        canvas.add(img).renderAll()
      })
    }
    reader.readAsDataURL(file)
    canvas.isDrawingMode = false
  }

  const handlePdfUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = function () {
      const loadingTask = window.pdfjsLib.getDocument({ data: reader.result })
      loadingTask.promise.then((pdf) => {
        const numPages = pdf.numPages
        setNumPages(numPages)

        // Load the first page as an example
        pdf.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1.5 })
          const canvasElement = document.createElement('canvas')
          const context = canvasElement.getContext('2d')

          canvasElement.height = viewport.height
          canvasElement.width = viewport.width

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }

          page.render(renderContext).promise.then(() => {
            const imgData = canvasElement.toDataURL('image/png')
            fabric.Image.fromURL(imgData, function (img) {
              img.scaleToWidth(600)
              canvas.add(img).renderAll()
            })
          })
        })
      })
    }
    reader.readAsArrayBuffer(file)
    canvas.isDrawingMode = false
  }

  const clearCanvas = () => {
    canvas.clear()
    canvas.renderAll()
  }

  const eraseMode = () => {
    setMode('erase')
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

  const downloadPDFWithAnnotations = async () => {
    if (
      !canvas ||
      !pdfDimensions.width ||
      !pdfDimensions.height ||
      !numPages ||
      !selectedFile
    ) {
      toast.error('Canvas, PDF dimensions, or pages not available.')
      return
    }

    try {
      const json = canvas.toJSON()

      // Read the selected PDF file
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(selectedFile)

      fileReader.onload = async function () {
        const originalPdfBytes = fileReader.result
        const originalPdfDoc = await PDFDocument.load(originalPdfBytes)
        const pdfDoc = await PDFDocument.create()

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          // Copy the original page from the original PDF
          const [originalPage] = await pdfDoc.copyPages(originalPdfDoc, [
            pageNum - 1,
          ])
          const page = pdfDoc.addPage(originalPage)

          // Load the canvas state for the current page
          setCurrPage(pageNum)
          loadCanvasState(pageNum) // Ensure this loads the correct state without resetting
          await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for the content to render

          // Ensure all objects are loaded and rendered
          canvas.renderAll()

          if (!json.objects || json.objects.length === 0) {
            toast.error('No objects found on the canvas for page ' + pageNum)
            return
          }

          // Iterate over the canvas objects and apply them to the PDF
          for (const obj of json.objects) {
            const type = obj.type.toLowerCase()

            switch (type) {
              case 'rect':
                page.drawRectangle({
                  x: obj.left,
                  y: pdfDimensions.height - obj.top - obj.height,
                  width: obj.width,
                  height: obj.height,
                  borderColor: rgb(
                    obj.stroke ? obj.stroke.r / 255 || 0 : 0,
                    obj.stroke ? obj.stroke.g / 255 || 0 : 0,
                    obj.stroke ? obj.stroke.b / 255 || 0 : 0
                  ),
                  borderWidth: obj.strokeWidth || 1,
                  color: rgb(
                    obj.fill ? obj.fill.r / 255 || 0 : 0,
                    obj.fill ? obj.fill.g / 255 || 0 : 0,
                    obj.fill ? obj.fill.b / 255 || 0 : 0
                  ),
                })
                break

              case 'circle':
                page.drawEllipse({
                  x: obj.left + obj.radius,
                  y: pdfDimensions.height - obj.top - obj.radius,
                  xScale: obj.radius,
                  yScale: obj.radius,
                  borderColor: rgb(
                    obj.stroke ? obj.stroke.r / 255 || 0 : 0,
                    obj.stroke ? obj.stroke.g / 255 || 0 : 0,
                    obj.stroke ? obj.stroke.b / 255 || 0 : 0
                  ),
                  borderWidth: obj.strokeWidth || 1,
                  color: rgb(
                    obj.fill ? obj.fill.r / 255 || 0 : 0,
                    obj.fill ? obj.fill.g / 255 || 0 : 0,
                    obj.fill ? obj.fill.b / 255 || 0 : 0
                  ),
                })
                break

              case 'textbox':
              case 'text':
                page.drawText(obj.text, {
                  x: obj.left,
                  y: pdfDimensions.height - obj.top - obj.fontSize,
                  size: obj.fontSize || 16,
                })
                break

              case 'image':
                // Handle SVG conversion to PNG for embedding
                const svgToPng = async (svgData) => {
                  const img = new Image()
                  img.src = svgData
                  await new Promise((resolve) => (img.onload = resolve))

                  const canvas = document.createElement('canvas')
                  canvas.width = img.width
                  canvas.height = img.height

                  const ctx = canvas.getContext('2d')
                  ctx.drawImage(img, 0, 0)

                  return canvas.toDataURL('image/png')
                }

                const pngDataUrl = await svgToPng(obj.src)
                const pngBytes = await fetch(pngDataUrl).then((res) =>
                  res.arrayBuffer()
                )
                const pngImage = await pdfDoc.embedPng(pngBytes)

                // Calculate transformation matrix
                const { left, top, width, height, scaleX, scaleY, angle } = obj

                // Apply the transformation directly when drawing the image
                page.drawImage(pngImage, {
                  x: left,
                  y: pdfDimensions.height - top - height * scaleY,
                  width: width * scaleX,
                  height: height * scaleY,
                  rotate: degrees(angle), // Rotation using degrees
                })
                break

              default:
                console.warn('Unhandled type:', type)
                break
            }
          }
        }

        canvas.renderAll()
        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'annotated_document.pdf'
        link.click()
      }
    } catch (error) {
      toast.error('Failed to download the PDF.')
    }
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

  const zoomIn = () => {
    if (canvas) {
      const zoom = canvas.getZoom() * 1.1 // Zoom in by 10%
      canvas.setZoom(zoom)

      // Adjust PDF dimensions
      setPdfDimensions({
        width: pdfDimensions.width * 1.1,
        height: pdfDimensions.height * 1.1,
      })
    }
  }

  const zoomOut = () => {
    if (canvas) {
      const zoom = canvas.getZoom() / 1.1 // Zoom out by 10%
      canvas.setZoom(zoom)

      // Adjust PDF dimensions
      setPdfDimensions({
        width: pdfDimensions.width / 1.1,
        height: pdfDimensions.height / 1.1,
      })
    }
  }

  const enablePan = () => {
    if (canvas) {
      canvas.isDrawingMode = false // Disable drawing mode if enabled
      canvas.selection = false // Disable selection

      // Handle panning
      let isPanning = false
      let lastPosX = 0
      let lastPosY = 0

      canvas.on('mouse:down', (event) => {
        isPanning = true
        const pointer = canvas.getPointer(event.e)
        lastPosX = pointer.x
        lastPosY = pointer.y
      })

      canvas.on('mouse:move', (event) => {
        if (isPanning) {
          const pointer = canvas.getPointer(event.e)
          const dx = pointer.x - lastPosX
          const dy = pointer.y - lastPosY

          const currentTransform = canvas.viewportTransform
          currentTransform[4] += dx
          currentTransform[5] += dy

          // Update PDF position accordingly
          const pdfWrapper = document.getElementById('pdfWrapper')
          pdfWrapper.style.transform = `translate(${currentTransform[4]}px, ${currentTransform[5]}px)`

          canvas.requestRenderAll()
          lastPosX = pointer.x
          lastPosY = pointer.y
        }
      })

      canvas.on('mouse:up', () => {
        isPanning = false
      })
    }
  }

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({
        width: pdfDimensions.width,
        height: pdfDimensions.height,
      })
    }
  }, [pdfDimensions])

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
        downloadPageAsPDF,
        addPdfDimensions,
        setHiddenCanvas,
        downloadJSON,
        loadNewPDF,
        clearCanvas,
        handlePdfUpload, // Function to load a new PDF
        handleImageUpload, // Function to load an image
        downloadCanvasAsImage, // Function to download canvas as an image
        downloadPageAsImage,
        setIsSelectFilePDF,
        isSelectFilePDF,
        downloadPDFWithAnnotations,
        zoomIn,
        zoomOut,
        enablePan,
      }}
    >
      {children}
    </editorFunctions.Provider>
  )
}
