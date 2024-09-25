// @ts-nocheck
import imageConstants from '@/constants/imageConstants'
import annotationApi from '@/service/annotationApi'
import { RootState } from '@/store'
import { changeSvgColor, getErrorMessage, hasPickWriteAccess } from '@/utils'
import * as fabric from 'fabric'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import debounce from 'lodash/debounce'
import { Pencil } from 'lucide-react'
import { PDFDocument, rgb } from 'pdf-lib'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const editorFunctions = createContext()
// Extend fabric objects globally to include custom properties like 'id' and 'status'
// Safely extend fabric.Object prototype to include custom properties (id, status)
fabric.Object.prototype.toObject = (function (toObject) {
  return function () {
    // Use Object.assign to ensure custom properties like id and status are added
    return Object.assign(toObject.call(this), {
      id: this.id || '', // Ensure id is set, even if it doesn't exist
      status: this.status || 'Pending', // Default status if not provided
    })
  }
})(fabric.Object.prototype.toObject)

export const useEditor = () => {
  return useContext(editorFunctions)
}

export const CanvasProvider = ({ children }) => {
  // Initialize currPage directly from localStorage
  const initialPage = parseInt(localStorage.getItem('currentPage'), 10) || 1
  const [currPage, setCurrPage] = useState(initialPage)
  const [numPages, setNumPages] = useState(null)
  const [isExporting, setExporting] = useState(false)
  const [hideCanvas, setHiddenCanvas] = useState(false)
  const [canvas, setCanvas] = useState<fabric.Canvas>(null)
  const [borderColor] = useState('red')
  const [color] = useState('#000000')
  const [mode, setMode] = useState('')
  const [activeIcon, setActiveIcon] = useState(null)
  const activeIconRef = useRef(activeIcon)
  const [exportPages, setExportPages] = useState([])
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
  const [annotations, setAnnotations] = useState({})
  const [isSelectFilePDF, setIsSelectFilePDF] = useState(false)
  const [allowPinchZoom, setAllowPinchZoom] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [originalPdfDimensions, setOriginalPdfDimensions] = useState({
    originalWidth: 0,
    originalHeight: 0,
  })
  const [annotationFromDB, setAnnotationFromDB] = useState(null)
  const [toggleAnnotationFetch, setToggleAnnotationFetch] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [showAnnotationModal, setShowAnnotationModal] = useState(false)
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const currentProjectModel = useSelector(
    (state: RootState) => state.projectModels.currentProjectModel
  )
  const hasWriteAccess = hasPickWriteAccess(
    currentProject?.permission,
    currentProjectModel?.ProjectModelAccess?.[0]?.permission
  )

  useEffect(() => {
    if (!canvas) return

    // Clean up previous event listeners
    resetCanvasListeners()

    if (mode === 'change-status') {
      canvas.selection = false // Disable group selection

      // Iterate over all objects on the canvas and disable movement/controls
      canvas.forEachObject((obj) => {
        obj.selectable = true // Enable selection
        obj.hasControls = false // Disable controls (resizing, rotating)
        obj.evented = true // Enable click events to be triggered
        obj.lockMovementX = true // Lock horizontal movement
        obj.lockMovementY = true // Lock vertical movement
        obj.lockScalingX = true // Lock scaling horizontally
        obj.lockScalingY = true // Lock scaling vertically
        obj.lockRotation = true // Lock rotation
      })

      // Add the event listener for mouse down only in change-status mode
      canvas.on('mouse:down', handleCanvasClick)
    } else if (mode === 'select') {
      // In select mode, enable controls and movement
      canvas.selection = true // Enable group selection
      canvas.forEachObject((obj) => {
        obj.selectable = true // Allow selection
        obj.hasControls = true // Enable controls (resizing, rotating)
        obj.evented = true // Enable interaction (dragging/moving)
        obj.lockMovementX = false // Unlock movement horizontally
        obj.lockMovementY = false // Unlock movement vertically
        obj.lockScalingX = false // Unlock scaling horizontally
        obj.lockScalingY = false // Unlock scaling vertically
        obj.lockRotation = false // Unlock rotation
      })

      // Clean up the canvas click listener from change-status mode
      canvas.off('mouse:down', handleCanvasClick)
    }

    // Render the canvas with the updated properties
    canvas.renderAll()

    return () => {
      // Clean up canvas listeners when unmounting or mode changes
      resetCanvasListeners()
    }
  }, [canvas, mode])

  // Debounced function to call the update API with conditional payload
  const debouncedUpdateAnnotation = debounce(
    async (annotationId, updatedData, isStatusUpdate = false) => {
      const projectId = currentProject?.id
      const projectModelId = currentProjectModel?.id

      if (!projectId || !projectModelId || !annotationId) {
        toast.error('Missing project or annotation details. Cannot update.')
        return
      }

      try {
        // Prepare payload: send status if it's a status update, otherwise send annotationData
        const payload = isStatusUpdate
          ? { status: updatedData.status } // Only send status for status update
          : { annotationData: updatedData } // Send entire annotation for position/size updates

        // Make the API call to update the annotation
        await annotationApi.updateSingleAnnotation(
          projectId,
          projectModelId,
          annotationId,
          payload
        )

        toast.success(
          isStatusUpdate
            ? 'Annotation status updated successfully.'
            : 'Annotation updated successfully.'
        )
      } catch (error) {
        toast.error(`Failed to update annotation: ${getErrorMessage(error)}`)
      }
    },
    300 // Debounce delay of 300ms
  )

  // Handle object modification (position or size changes)
  const handleObjectModified = (event) => {
    const activeObject = event.target
    if (!activeObject) return

    // Get the old object data (unchanged keys) using the fabric.js `toObject` method
    const oldData = activeObject.toObject()

    // Prepare the updated data for position and size changes
    const updatedData = {
      ...oldData, // Include the old data with unchanged keys
      left: activeObject.left, // New position X
      top: activeObject.top, // New position Y
      scaleX: activeObject.scaleX, // New width scaling
      scaleY: activeObject.scaleY, // New height scaling
      width: activeObject.width * activeObject.scaleX, // New width
      height: activeObject.height * activeObject.scaleY, // New height
    }

    const annotationId = activeObject.id // Assuming each object has a unique `id`

    // Trigger the debounced API call with the updated data (position/size changes)
    debouncedUpdateAnnotation(annotationId, updatedData, false) // false indicates this is not a status update
  }

  // Attach event listeners to Fabric.js canvas for size and position changes
  useEffect(() => {
    if (canvas) {
      // Listen to scaling (size change), moving (position change), and modification events
      canvas.on('object:scaling', handleObjectModified)
      canvas.on('object:moving', handleObjectModified)
      canvas.on('object:modified', handleObjectModified) // Trigger on finish move/scale

      // Clean up event listeners when the component unmounts or canvas changes
      return () => {
        canvas.off('object:scaling', handleObjectModified)
        canvas.off('object:moving', handleObjectModified)
        canvas.off('object:modified', handleObjectModified)
      }
    }
  }, [canvas])

  const deleteAnnotationById = async (annotationId) => {
    const projectId = currentProject?.id
    const projectModelId = currentProjectModel?.id

    if (!projectId || !projectModelId || !annotationId) {
      toast.error('Missing project or annotation details. Cannot delete.')
      return
    }

    try {
      await annotationApi.deleteSingleAnnotation(
        projectId,
        projectModelId,
        annotationId
      )
      toast.success('Annotation deleted successfully')

      // Optionally, remove the annotation from the canvas and re-render it
      if (canvas) {
        const objectToRemove = canvas
          .getObjects()
          .find((obj) => obj.id === annotationId)
        if (objectToRemove) {
          canvas.remove(objectToRemove)
          canvas.renderAll()
          saveCanvasState(currPage) // Save the updated canvas state
        }
      }
    } catch (error) {
      toast.error(`Failed to delete annotation: ${getErrorMessage(error)}`)
    }
  }

  const formatAnnotationData = (annotation) => {
    const { annotationData } = annotation

    // Check if the annotation is a group (multiple objects)
    if (annotationData.type === 'Group') {
      return {
        ...annotationData, // Spread the existing properties
        objects: annotationData.objects.map((obj) => ({
          ...obj,
          id: annotation.id, // Add the annotation's unique id to the objects
        })),
        id: annotation.id, // Set unique id for the group itself
        status: annotation.status, // Set the status
      }
    }

    // If not a group, return it directly (this example assumes all annotations are groups)
    return {
      ...annotationData,
      id: annotation.id, // Add the annotation's unique id
      status: annotation.status, // Set the status
    }
  }
  const saveAnnotation = async (annotationData, pageNumber) => {
    const projectId = currentProject?.id
    const projectModelId = currentProjectModel?.id
    const pickModelComponentId = selectedTool?.id

    if (!projectId || !projectModelId || !pickModelComponentId) {
      toast.error('Project information is missing. Unable to save annotation.')
      return
    }

    try {
      // Call the backend API to save the annotation
      const savedAnnotation = await annotationApi.saveSingleAnnotation(
        projectId,
        projectModelId,
        { pageNumber, annotationData, pickModelComponentId }
      )

      toast.success('Annotation saved successfully')
      setToggleAnnotationFetch((prevState) => !prevState)
      // Re-render the canvas to reflect the changes
      canvas.renderAll()
    } catch (error) {
      console.error('Failed to save annotation', error)
      toast.error('Failed to save annotation')
    }
  }

  const disableCanvasInteractions = () => {
    if (canvas && !hasWriteAccess) {
      // Disable group selection
      canvas.selection = false

      // Disable selection and movement for all objects on the canvas
      canvas.forEachObject((obj) => {
        obj.selectable = false // Disable object selection
        obj.evented = false // Disable object interaction (e.g., dragging)
        obj.hasControls = false // Disable resizing/rotating controls
      })

      // Change the cursor to indicate a non-interactive state
      canvas.defaultCursor = 'not-allowed'
      canvas.hoverCursor = 'not-allowed'

      canvas.renderAll()
    }
  }

  const enableCanvasInteractions = () => {
    if (canvas && hasWriteAccess) {
      // Enable group selection
      canvas.selection = true

      // Enable selection and movement for all objects on the canvas
      canvas.forEachObject((obj) => {
        obj.selectable = true // Enable object selection
        obj.evented = true // Enable object interaction (e.g., dragging)
        obj.hasControls = true // Enable resizing/rotating controls
      })

      // Restore the default cursor
      canvas.defaultCursor = 'default'
      canvas.hoverCursor = 'pointer'

      canvas.renderAll()
    }
  }

  useEffect(() => {
    if (hasWriteAccess) {
      enableCanvasInteractions()
    } else {
      disableCanvasInteractions()
    }
  }, [canvas, hasWriteAccess])

  useEffect(() => {
    activeIconRef.current = activeIcon
    updateCursorStyle()
  }, [activeIcon])

  const changeAnnotationStatusById = async (
    annotationId,
    newStatus,
    pageNumber = currPage
  ) => {
    if (!canvas) return

    // Define colors based on the status
    const statusColors = {
      Pending: 'red',
      Working: 'blue',
      Completed: 'green',
    }

    // Helper function to map status to color
    const getStatusColor = (status) => {
      return statusColors[status] || 'black'
    }

    // Find all objects in the canvas
    const objects = canvas.getObjects()

    // Loop through all objects and check their type and id
    for (const annotation of objects) {
      // If it's the matching annotation by its id
      if (annotation.id === annotationId) {
        // Update the status of the selected annotation
        annotation.set({ status: newStatus })

        // Get the new color based on the status
        const newColor = getStatusColor(newStatus)

        // If the annotation is a group, process its objects
        if (annotation.type === 'group') {
          for (const groupObj of annotation.getObjects()) {
            const groupType = groupObj.type.toLowerCase()

            // Change the rectangle's stroke color based on the status
            if (groupType === 'rect') {
              groupObj.set({
                stroke: newColor, // Changing the stroke color of the rectangle
              })
            }

            // Change the icon (SVG) color based on the status
            if (groupType === 'image') {
              try {
                const coloredSvg = await changeSvgColor(groupObj.src, newColor)

                if (coloredSvg) {
                  groupObj.set({
                    src: coloredSvg, // Set the new colored SVG as the source
                  })
                } else {
                  console.error('Failed to change SVG color')
                }
              } catch (error) {
                console.error('Error changing SVG color:', error)
              }
            }
          }
        } else if (annotation.type === 'rect') {
          // If the annotation is directly a rectangle, apply border color change
          annotation.set({
            stroke: newColor, // Change the border color directly
          })
        } else if (annotation.type === 'image') {
          // If it's an image, change the SVG color
          try {
            const coloredSvg = await changeSvgColor(annotation.src, newColor)

            if (coloredSvg) {
              annotation.set({
                src: coloredSvg, // Change the image source to the updated SVG
              })
            } else {
              console.error('Failed to change SVG color')
            }
          } catch (error) {
            console.error('Error changing SVG color:', error)
          }
        }

        // Force re-rendering the canvas after updates
        canvas.renderAll()

        // Save the updated canvas state
        saveCanvasState(pageNumber)

        // Call the API to update the annotation in the database
        try {
          const projectId = currentProject?.id
          const projectModelId = currentProjectModel?.id

          if (projectId && projectModelId) {
            // Call the update API with only the status update, not the entire annotationData
            await annotationApi.updateSingleAnnotation(
              projectId,
              projectModelId,
              annotationId,
              { status: newStatus } // Send only the status in this case
            )

            toast.success('Annotation status updated successfully!')
          }
        } catch (error) {
          console.error('Failed to update annotation on the server:', error)
          toast.error(getErrorMessage(error))
        }

        // Close the modal after updating
        setShowAnnotationModal(false)
        return // Stop after finding and updating the matching annotation
      }
    }

    // If no matching annotation found, show error
    toast.error('Annotation not found')
  }

  let previewRect = null // Store the preview rectangle
  let cachedImgElement = null // Cache the image once it's loaded

  const drawCrosshairsWithRectanglePreview = (pointer) => {
    const overlayCtx = canvas.getSelectionContext() // Get Fabric.js overlay context

    // Clear previous crosshairs and preview rectangle on the overlay
    canvas.clearContext(canvas.contextTop)

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    // Save the current state of the context
    overlayCtx.save()

    // If there's an icon selected (activeIcon), show the preview rectangle
    if (activeIconRef.current) {
      // If the image is not cached, load it
      if (!cachedImgElement) {
        cachedImgElement = new Image()
        cachedImgElement.src = activeIconRef.current

        cachedImgElement.onload = () => {
          const imgWidth = cachedImgElement.width
          const imgHeight = cachedImgElement.height

          // Coordinates for the edges of the rectangle
          const leftX = pointer.x - imgWidth / 2 // Left edge
          const rightX = pointer.x + imgWidth / 2 // Right edge
          const topY = pointer.y - imgHeight / 2 // Top edge
          const bottomY = pointer.y + imgHeight / 2 // Bottom edge

          // Draw the rectangle preview first
          overlayCtx.beginPath()
          overlayCtx.strokeStyle = 'rgba(244, 162, 97, 0.8)' // Border color for rectangle
          overlayCtx.lineWidth = 2
          overlayCtx.setLineDash([10, 4]) // Solid lines for the rectangle
          overlayCtx.rect(leftX, topY, imgWidth, imgHeight)
          overlayCtx.stroke()

          // Now draw crosshairs from the rectangle edges in both directions
          // Vertical crosshairs (extend upwards and downwards from left and right edges)
          overlayCtx.beginPath()
          // Left vertical crosshair (upwards and downwards from the left edge)
          overlayCtx.moveTo(leftX, 0) // From the top of the canvas to the left edge of the rectangle
          overlayCtx.lineTo(leftX, topY) // Top of the rectangle
          overlayCtx.moveTo(leftX, bottomY) // Bottom of the rectangle
          overlayCtx.lineTo(leftX, canvasHeight) // Down to the bottom of the canvas

          // Right vertical crosshair (upwards and downwards from the right edge)
          overlayCtx.moveTo(rightX, 0) // From the top of the canvas to the right edge of the rectangle
          overlayCtx.lineTo(rightX, topY) // Top of the rectangle
          overlayCtx.moveTo(rightX, bottomY) // Bottom of the rectangle
          overlayCtx.lineTo(rightX, canvasHeight) // Down to the bottom of the canvas
          overlayCtx.stroke()

          // Horizontal crosshairs (extend leftwards and rightwards from top and bottom edges)
          overlayCtx.beginPath()
          // Top horizontal crosshair (leftwards and rightwards from the top edge)
          overlayCtx.moveTo(0, topY) // From the left of the canvas to the top of the rectangle
          overlayCtx.lineTo(leftX, topY) // Left edge of rectangle
          overlayCtx.moveTo(rightX, topY) // Right edge of rectangle
          overlayCtx.lineTo(canvasWidth, topY) // Extend to the right of the canvas

          // Bottom horizontal crosshair (leftwards and rightwards from the bottom edge)
          overlayCtx.moveTo(0, bottomY) // From the left of the canvas to the bottom of the rectangle
          overlayCtx.lineTo(leftX, bottomY) // Left edge of rectangle
          overlayCtx.moveTo(rightX, bottomY) // Right edge of rectangle
          overlayCtx.lineTo(canvasWidth, bottomY) // Extend to the right of the canvas
          overlayCtx.stroke()
        }
      } else {
        // If the image is already cached, draw the rectangle immediately
        const imgWidth = cachedImgElement.width
        const imgHeight = cachedImgElement.height

        const leftX = pointer.x - imgWidth / 2 // Left edge
        const rightX = pointer.x + imgWidth / 2 // Right edge
        const topY = pointer.y - imgHeight / 2 // Top edge
        const bottomY = pointer.y + imgHeight / 2 // Bottom edge

        // Draw the rectangle preview
        overlayCtx.beginPath()
        overlayCtx.strokeStyle = 'rgba(244, 162, 97, 0.8)' // Border color for rectangle
        overlayCtx.lineWidth = 2
        overlayCtx.setLineDash([10, 4]) // Solid lines for the rectangle
        overlayCtx.rect(leftX, topY, imgWidth, imgHeight)
        overlayCtx.stroke()

        // Now draw crosshairs from the rectangle edges in both directions
        // Vertical crosshairs (extend upwards and downwards from left and right edges)
        overlayCtx.beginPath()
        // Left vertical crosshair (upwards and downwards from the left edge)
        overlayCtx.moveTo(leftX, 0) // From the top of the canvas to the left edge of the rectangle
        overlayCtx.lineTo(leftX, topY) // Top of the rectangle
        overlayCtx.moveTo(leftX, bottomY) // Bottom of the rectangle
        overlayCtx.lineTo(leftX, canvasHeight) // Down to the bottom of the canvas

        // Right vertical crosshair (upwards and downwards from the right edge)
        overlayCtx.moveTo(rightX, 0) // From the top of the canvas to the right edge of the rectangle
        overlayCtx.lineTo(rightX, topY) // Top of the rectangle
        overlayCtx.moveTo(rightX, bottomY) // Bottom of the rectangle
        overlayCtx.lineTo(rightX, canvasHeight) // Down to the bottom of the canvas
        overlayCtx.stroke()

        // Horizontal crosshairs (extend leftwards and rightwards from top and bottom edges)
        overlayCtx.beginPath()
        // Top horizontal crosshair (leftwards and rightwards from the top edge)
        overlayCtx.moveTo(0, topY) // From the left of the canvas to the top of the rectangle
        overlayCtx.lineTo(leftX, topY) // Left edge of rectangle
        overlayCtx.moveTo(rightX, topY) // Right edge of rectangle
        overlayCtx.lineTo(canvasWidth, topY) // Extend to the right of the canvas

        // Bottom horizontal crosshair (leftwards and rightwards from the bottom edge)
        overlayCtx.moveTo(0, bottomY) // From the left of the canvas to the bottom of the rectangle
        overlayCtx.lineTo(leftX, bottomY) // Left edge of rectangle
        overlayCtx.moveTo(rightX, bottomY) // Right edge of rectangle
        overlayCtx.lineTo(canvasWidth, bottomY) // Extend to the right of the canvas
        overlayCtx.stroke()
      }
    }

    // Restore the context state to avoid affecting other drawings
    overlayCtx.restore()
  }

  // Handle mouse move event to draw the enhanced crosshairs and rectangle preview
  const handleMouseMove = (event) => {
    // Only proceed if the canvas exists and the mode is "addIcon"
    if (!canvas || mode !== 'addIcon') return

    const pointer = canvas.getPointer(event.e)
    drawCrosshairsWithRectanglePreview(pointer) // Draw the crosshairs only in addIcon mode
  }

  // Handle mouse out (remove crosshairs and rectangle preview when leaving the canvas)
  const handleMouseOut = () => {
    // Clear the overlay context
    if (canvas) {
      canvas.clearContext(canvas.contextTop)
    }
  }

  // Initialize crosshairs with rectangle preview when the canvas is ready
  useEffect(() => {
    if (!canvas) return

    if (mode === 'addIcon') {
      // Bind mouse move and mouse out events only in addIcon mode
      canvas.on('mouse:move', handleMouseMove)
      canvas.on('mouse:out', handleMouseOut)
    } else {
      // Clear the overlay if not in addIcon mode
      canvas.clearContext(canvas.contextTop)
    }

    return () => {
      // Remove event listeners when the component is unmounted or mode changes
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:out', handleMouseOut)
    }
  }, [canvas, activeIconRef.current, mode])

  const saveCanvasState = (pageNumber) => {
    if (canvas) {
      const canvasJson = canvas.toJSON()
      setAnnotations((prevEdits) => ({
        ...prevEdits,
        [pageNumber]: canvasJson,
      }))
    }
  }

  const setCurrPageWithStorage = (page) => {
    setCurrPage(page)
    localStorage.setItem('currentPage', page) // Save the current page to localStorage
  }

  const loadCanvasState = async (pageNumber = currPage, data = null) => {
    const canvasJson = annotations[pageNumber]

    if (canvas) {
      const modifyObjectsBasedOnStatus = async (canvasData) => {
        if (!canvasData?.objects) return canvasData

        // Helper function to map status to color
        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case 'pending':
              return 'red'
            case 'completed':
              return 'green'
            case 'working':
              return 'blue'
            default:
              return null
          }
        }

        // Loop through all objects and modify them based on their status
        for (const obj of canvasData.objects) {
          const type = obj.type.toLowerCase()
          const statusColor = getStatusColor(obj.status)

          if (type === 'group' && statusColor) {
            // Loop through the group objects (rect and image)
            for (const groupObj of obj.objects) {
              const groupType = groupObj.type.toLowerCase()

              // Change the rectangle's stroke color based on the status
              if (groupType === 'rect') {
                groupObj.stroke = statusColor // Changing the stroke color of the rectangle
              }

              // Change the icon (SVG) color based on the status
              // if (groupType === 'image') {
              //   // Use your existing changeSvgColor function to modify the SVG color
              //   const coloredSvg = await changeSvgColor(
              //     groupObj.src,
              //     statusColor
              //   )
              //   groupObj.src = coloredSvg // Set the new colored SVG as the source
              // }
            }
          }
        }

        return canvasData
      }

      // Check if annotations exist for the page
      if (canvasJson) {
        const modifiedCanvasJson = await modifyObjectsBasedOnStatus(
          data || canvasJson
        )

        // Safely load the modified JSON into the canvas
        canvas.loadFromJSON(modifiedCanvasJson, () => {
          canvas.renderAll()
          setTimeout(() => {
            canvas.renderAll()
          }, 100)
        })
      } else {
        console.warn('No canvas data found for page:', pageNumber)
      }
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
    if (!hasWriteAccess) {
      toast.error('You do not have write access to edit this canvas.')
      return
    }
    if (allowPinchZoom || !canvas || mode === 'erase') return

    const pointer = canvas.getPointer(event.e)
    const viewportTransform = canvas.viewportTransform
    const realPoint = fabric.util.transformPoint(
      pointer,
      fabric.util.invertTransform(viewportTransform)
    )
    const x = realPoint.x
    const y = realPoint.y

    const status = 'new'

    let newAnnotation = null // To store the new annotation data

    if (mode === 'change-status' || mode === '') {
      const activeObject = canvas.getActiveObject()

      if (activeObject) {
        // Disable controls for resizing, rotating, and moving
        activeObject.lockMovementX = true
        activeObject.lockMovementY = true
        activeObject.hasControls = false // Remove controls to prevent editing
        activeObject.selectable = true // Allow selection for status change

        // Optional: Set controls visibility to false, so the user can't see them

        // Ensure the object doesn't move when clicked
        activeObject.lockMovementX = true
        activeObject.lockMovementY = true

        // Ensure custom properties are retained
        const activeObjectJson = activeObject.toObject()

        // Log custom properties to confirm they are present

        setSelectedAnnotation({
          ...activeObjectJson,
          id: activeObject.id || 'default-id', // Ensure 'id' is included
          status: activeObject.status || 'new', // Ensure 'status' is included
        })

        setShowAnnotationModal(true)

        // Re-render the canvas to reflect changes
        canvas.renderAll()
      }
    } else if (mode === 'create-rect') {
      const rect = new fabric.Rect({
        originX: 'center',
        originY: 'center',
        left: x,
        top: y,
        height: 50,
        width: 50,
        fill: 'transparent',
        stroke: borderColor,
        selectable: true,
      })
      canvas.add(rect)
      newAnnotation = rect.toObject()
    } else if (mode === 'create-circle') {
      const circle = new fabric.Circle({
        originX: 'center',
        originY: 'center',
        left: x,
        top: y,
        radius: 50,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: 2,
        selectable: true,
      })
      canvas.add(circle)
      newAnnotation = circle.toObject()
    } else if (mode === 'create-text') {
      const text = new fabric.Textbox('', {
        originX: 'center',
        originY: 'center',
        left: x,
        top: y,
        fill: color,
        fontFamily: 'roboto',
        selectable: true,
        editable: true,
      })
      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      newAnnotation = text.toObject()
    } else if (mode === 'addIcon' && activeIconRef.current) {
      const originalIconUrl = activeIconRef.current

      const imgElement = document.createElement('img')
      imgElement.crossOrigin = 'anonymous'
      imgElement.src = originalIconUrl

      imgElement.onload = function () {
        const img = new fabric.Image(imgElement, {
          originX: 'center',
          originY: 'center',
          left: x,
          top: y,
          selectable: true,
          scaleX: 1,
          scaleY: 1,
        })

        const rect = new fabric.Rect({
          originX: 'center',
          originY: 'center',
          left: x,
          top: y,
          width: img.width,
          height: img.height,
          fill: 'transparent',
          stroke: borderColor,
          strokeWidth: 2,
          selectable: true,
        })

        const group = new fabric.Group([rect, img], {
          originX: 'center',
          originY: 'center',
          selectable: true,
          hasControls: true,
          evented: true,
        })

        canvas.add(group)
        newAnnotation = group.toObject()
        canvas.renderAll()

        // Save annotation to the server after adding to the canvas
        saveAnnotation(newAnnotation, currPage)
      }
    }

    // Save canvas state and annotation to the server
    if (newAnnotation) {
      saveCanvasState(currPage)
      await saveAnnotation(newAnnotation, currPage) // Call save function
    }
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

  const removeObject = async (event) => {
    if (mode === 'erase' && canvas) {
      const target = canvas.findTarget(event.e) // Find the object on the canvas
      if (target) {
        // Assuming each object on the canvas has a unique `annotationId` stored in `target.annotationId`
        const annotationId = target.id

        if (!annotationId) {
          toast.error('Annotation ID not found. Cannot delete.')
          return
        }

        // Remove the object from the canvas
        canvas.remove(target)
        canvas.renderAll()

        // Save the updated canvas state
        saveCanvasState(currPage)

        // Now delete the annotation from the backend
        try {
          const projectId = currentProject?.id
          const projectModelId = currentProjectModel?.id

          if (!projectId || !projectModelId) {
            toast.error(
              'Project or model information is missing. Cannot delete.'
            )
            return
          }

          // Call the API to delete the annotation using annotationId
          await annotationApi.deleteSingleAnnotation(
            projectId,
            projectModelId,
            annotationId
          )

          toast.success('Annotation deleted successfully.')
        } catch (error) {
          toast.error(`Failed to delete annotation: ${getErrorMessage(error)}`)
        }
      }
    }
  }

  const updateCursorStyle = () => {
    if (!canvas) return
    if (mode === 'erase') {
      canvas.defaultCursor = `url(${imageConstants.removeCursor}) 12 12, auto`
      canvas.hoverCursor = `url(${imageConstants.removeCursor}) 12 12, auto`
    } else if (mode === 'select' || mode === 'move') {
      canvas.defaultCursor = `url(${imageConstants.SelectIcon}) 12 12, auto`
    } else if (mode === 'addIcon') {
      canvas.defaultCursor = `url(${activeIconRef.current}) 12 12, auto`
    } else if (mode === 'change-status') {
      canvas.defaultCursor = `url(${Pencil}) 12 12, auto`
      canvas.hoverCursor = `url(${imageConstants.changeStatusCursor}) 12 12, auto`
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
      canvas.forEachObject((obj) => (obj.selectable = true))
      canvas.on('mouse:down', handleCanvasClick)
    } else if (mode === 'erase') {
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = false))
      canvas.on('mouse:down', removeObject)
    } else if (mode === 'select' || mode === 'move') {
      canvas.selection = true
      canvas.forEachObject((obj) => (obj.selectable = true))
    } else if (mode === 'change-status' || mode === '') {
      canvas.selection = false
      canvas.forEachObject((obj) => (obj.selectable = true))
      canvas.on('mouse:down', handleCanvasClick)
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

    // Hide the buttons temporarily
    const buttons = document.querySelectorAll('.export-exclude')
    buttons.forEach((button) => {
      button.style.visibility = 'hidden' // Hide buttons
    })

    const doc = document.querySelector('#singlePageExport')

    html2canvas(doc, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvasEl) => {
        const imgData = canvasEl.toDataURL('image/png')

        const link = document.createElement('a')
        link.href = imgData
        link.download = `annotated_page_${currPage}.png`
        link.click()

        setExporting(false)

        // Show the buttons again
        buttons.forEach((button) => {
          button.style.visibility = 'visible' // Show buttons
        })
      })
      .catch((error) => {
        toast.error('Failed to download the image.')
        setExporting(false)

        // Show the buttons again if an error occurs
        buttons.forEach((button) => {
          button.style.visibility = 'visible' // Show buttons
        })
      })
  }

  const downloadPageAsPDF = () => {
    if (!canvas || !pdfDimensions.width || !pdfDimensions.height) {
      toast.error('Canvas or PDF dimensions are not available.')
      return
    }

    setExporting(true)

    canvas.renderAll()
    const doc = document.querySelector('#singlePageExport')
    html2canvas(doc, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvasEl) => {
        const imgData = canvasEl.toDataURL('image/png')

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [pdfDimensions.width, pdfDimensions.height],
        })

        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          pdfDimensions.width,
          pdfDimensions.height
        )

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
      canvas.renderAll()

      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
        multiplier: 2,
      })

      const link = document.createElement('a')
      link.href = dataURL
      link.download = `canvas_${currPage}.png`
      link.click()
    }
  }

  const handleImageUpload = (e) => {
    if (allowPinchZoom) {
      return
    }

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
    saveCanvasState(currPage)
  }

  const eraseMode = () => {
    setMode('erase')
  }

  const addRect = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setMode('create-rect')
  }

  const changeStatus = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to change status.')
      return
    }
    setMode('change-status')
  }

  const addCircle = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setMode('create-circle')
  }

  const addText = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setMode('create-text')
  }

  const selectMode = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setMode('select')
  }

  const moveMode = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setMode('move')
  }

  const downloadPDFWithAnnotations = async () => {
    let selectedFile = currentProjectModel?.fileUrl

    if (
      !pdfDimensions.width ||
      !pdfDimensions.height ||
      !numPages ||
      !selectedFile
    ) {
      toast.error('PDF dimensions or pages not available.')
      return
    }

    try {
      // Fetch the original PDF
      const response = await fetch(selectedFile)
      if (!response.ok) {
        toast.error('Failed to fetch the PDF from the URL.')
        return
      }

      const originalPdfBytes = await response.arrayBuffer()
      const originalPdfDoc = await PDFDocument.load(originalPdfBytes)
      const pages = originalPdfDoc.getPages()

      if (!pages || pages.length === 0) {
        toast.error('No pages found in the PDF.')
        return
      }

      const pdfDoc = await PDFDocument.create()
      const pageHeight = pages[0].getHeight()
      const pageWidth = pages[0].getWidth()

      if (!pageHeight || !pageWidth) {
        toast.error('Unable to get page dimensions.')
        return
      }

      const scalingFactor = pageWidth / pdfDimensions.width

      const statusColors = {
        Pending: rgb(1, 0, 0), // Red
        Working: rgb(0, 0, 1), // Blue
        Completed: rgb(0, 1, 0), // Green
      }

      const svgToPng = async (svgData) => {
        const img = new Image()
        img.src = svgData
        await new Promise((resolve) => (img.onload = resolve))

        const canvasEl = document.createElement('canvas')
        canvasEl.width = img.width
        canvasEl.height = img.height

        const ctx = canvasEl.getContext('2d')
        ctx.drawImage(img, 0, 0)

        return canvasEl.toDataURL('image/png')
      }

      // Loop through each page in the annotations object
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const annotations = annotationFromDB[pageNum] // Get annotations for the current page
        const [originalPage] = await pdfDoc.copyPages(originalPdfDoc, [
          pageNum - 1,
        ])
        const page = pdfDoc.addPage(originalPage)

        if (!annotations || annotations.objects.length === 0) {
          console.warn(`No annotations found for page ${pageNum}`)
          continue
        }

        // Process annotations on the current page
        for (const obj of annotations.objects) {
          const type = obj.type.toLowerCase()
          const x = obj.left * scalingFactor
          const y =
            pageHeight - obj.top * scalingFactor - obj.height * scalingFactor

          switch (type) {
            case 'text':
              page.drawText(obj.text, {
                x,
                y,
                size: (obj.fontSize || 16) * scalingFactor,
                color: rgb(0, 0, 0), // Default black text color
              })
              break

            case 'rect':
              const borderColor = statusColors[obj.status] || rgb(0, 0, 0) // Apply color based on status
              page.drawRectangle({
                x,
                y,
                width: obj.width * scalingFactor,
                height: obj.height * scalingFactor,
                borderColor: borderColor,
                borderWidth: obj.strokeWidth || 1,
              })
              break

            case 'image':
              const pngDataUrl = await svgToPng(obj.src)
              const pngBytes = await fetch(pngDataUrl).then((res) =>
                res.arrayBuffer()
              )
              const pngImage = await pdfDoc.embedPng(pngBytes)
              page.drawImage(pngImage, {
                x,
                y,
                width: obj.width * scalingFactor,
                height: obj.height * scalingFactor,
              })
              break

            case 'group':
              const offset = 45
              for (const groupObj of obj.objects) {
                const groupType = groupObj.type.toLowerCase()

                const groupX =
                  (obj.left + (groupObj.left || 0)) * scalingFactor - offset
                const groupY =
                  pageHeight -
                  (obj.top + (groupObj.top || 0) + groupObj.height) *
                    scalingFactor +
                  offset        
                  \ 

                  \ \          

                if (groupType === 'rect') {
                  const groupBorderColor =
                    statusColors[obj.status] || rgb(0, 0, 0) // Apply color based on group status
                  page.drawRectangle({
                    x: groupX,
                    y: groupY,
                    width: groupObj.width * scalingFactor,
                    height: groupObj.height * scalingFactor,
                    borderColor: groupBorderColor,
                    borderWidth: groupObj.strokeWidth * scalingFactor || 1,
                  })
                } else if (groupType === 'image') {
                  const groupPngDataUrl = await svgToPng(groupObj.src)
                  const groupPngBytes = await fetch(groupPngDataUrl).then(
                    (res) => res.arrayBuffer()
                  )
                  const groupPngImage = await pdfDoc.embedPng(groupPngBytes)
                  page.drawImage(groupPngImage, {
                    x: groupX,
                    y: groupY,
                    width: groupObj.width * scalingFactor,
                    height: groupObj.height * scalingFactor,
                  })
                }
              }
              break

            default:
              console.warn('Unhandled annotation type:', type)
              break
          }
        }
      }

      // Save and download the PDF with annotations
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'annotated_document.pdf'
      link.click()
    } catch (error) {
      toast.error('Failed to download the PDF.')
      console.error(error)
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
    canvas.getObjects().forEach((item) => item.set({ selectable: true }))
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
          selectable: true,
          scaleX: 1,
          scaleY: 1,
        })

        img.id = uuidv4() // Set a unique id for the object

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
        selectable: true,
      })

      drawInstance.toObject = (function (toObject) {
        return function () {
          return fabric.util.object.extend(toObject.call(this), {
            id: uuidv4(),
            ...selectedTool,
          })
        }
      })(drawInstance.toObject)

      canvas.add(drawInstance)
    }
  }

  const addIcon = ({ icon, tool }) => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to add shapes.')
      return
    }
    setSelectedTool(tool)
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
    setSelectedFile(file)
    setAnnotations({})
    setExportPages([])
  }

  const zoomIn = () => {
    if (canvas) {
      const zoom = canvas.getZoom() * 1.1
      canvas.setZoom(zoom)

      setPdfDimensions({
        width: pdfDimensions.width * 1.1,
        height: pdfDimensions.height * 1.1,
      })
    }
  }

  const zoomOut = () => {
    if (canvas) {
      const zoom = canvas.getZoom() / 1.1
      canvas.setZoom(zoom)

      setPdfDimensions({
        width: pdfDimensions.width / 1.1,
        height: pdfDimensions.height / 1.1,
      })
    }
  }

  const enablePan = () => {
    if (!hasWriteAccess) {
      toast.error('You do not have write access to modify this canvas.')
      return
    }
    if (canvas) {
      canvas.isDrawingMode = false
      canvas.selection = false

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
    if (!canvas) return
    if (allowPinchZoom) {
      setMode('freeze')
      canvas.selection = false
    }
  }, [allowPinchZoom])

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
        setCurrPage: setCurrPageWithStorage,
        selectedFile,
        setSelectedFile,
        annotations,
        setAnnotations,
        downloadPageAsPDF,
        addPdfDimensions,
        setHiddenCanvas,
        downloadJSON,
        loadNewPDF,
        clearCanvas,
        handlePdfUpload,
        handleImageUpload,
        downloadCanvasAsImage,
        downloadPageAsImage,
        setIsSelectFilePDF,
        isSelectFilePDF,
        downloadPDFWithAnnotations,
        zoomIn,
        zoomOut,
        enablePan,
        allowPinchZoom,
        loadCanvasState,
        setAllowPinchZoom,
        setOriginalPdfDimensions,
        originalPdfDimensions,
        toggleAnnotationFetch,
        changeStatus,
        showAnnotationModal,
        setShowAnnotationModal,
        selectedAnnotation,
        setSelectedAnnotation,
        changeAnnotationStatusById,
        setAnnotationFromDB,
      }}
    >
      {children}
    </editorFunctions.Provider>
  )
}
