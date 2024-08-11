// @ts-nocheck

import * as fabric from 'fabric'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useRef } from 'react'

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
  const [canvas, setCanvas] = React.useState<fabric.Canvas>('')
  const [borderColor] = React.useState('#f4a261')
  const [color] = React.useState('#f4a261')

  const exportPage = useRef(null)
  const [exportPages, setExportPages] = React.useState([])

  const [edits, setEdits] = React.useState({})

  React.useEffect(() => {
    if (document.getElementById('canvasWrapper'))
      document.getElementById('canvasWrapper').style.visibility =
        document.getElementById('canvasWrapper').style.visibility == 'hidden'
          ? 'visible'
          : 'hidden'
  }, [hideCanvas])

  // React.useEffect(() => {
  // To Do: throwing error on 'on is not a function'
  // canvas?.on('mouse:wheel', function(opt) {
  //     var delta = opt.e.deltaY;
  //     var zoom = canvas.getZoom();
  //     zoom *= 0.999 ** delta;
  //     if (zoom > 20) zoom = 20;
  //     if (zoom < 0.01) zoom = 0.01;
  //     canvas.setZoom(zoom);
  //     opt.e.preventDefault();
  //     opt.e.stopPropagation();
  //   })
  // }, [canvas])

  const downloadPage = () => {
    var json = canvas.toJSON()
    console.log(json)

    setExporting(true)
    const doc = document.querySelector('#singlePageExport')
    html2canvas(doc).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
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
        var dataURL = canvas.toDataURL({ format: 'png', quality: 0.8 })
      })
    }
    reader.readAsDataURL(file)
    canvas.isDrawingMode = false
  }

  const deleteBtn = () => {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
    }
  }

  const addRect = (canvas) => {
    const rect = new fabric.Rect({
      height: 50,
      width: 50,
      fill: 'transparent',
      stroke: borderColor,
      cornerStyle: 'circle',
      editable: true,
      top: 100,
      left: 100,
    })
    canvas.add(rect)
    canvas.renderAll()
    canvas.isDrawingMode = false
  }

  const addCircle = (canvas: fabric.Canvas) => {
    const rect = new fabric.Circle({
      radius: 50,
      fill: 'transparent',
      cornerStyle: 'circle',
      editable: true,
      stroke: borderColor,
      strokeWidth: 2,
    })
    canvas.add(rect)
    canvas.renderAll()
    canvas.isDrawingMode = false
  }

  const addText = (canvas) => {
    const text = new fabric.Textbox('Type Here ...', {
      editable: true,
    })
    // text.set({ fill: color })
    text.set({ fill: color, fontFamily: 'roboto' })
    canvas.add(text)
    canvas.renderAll()
    canvas.isDrawingMode = false
  }

  const exportPdf = () => {
    setExportPages((prev) => [...prev, exportPage.current])
    console.log(exportPages)
  }

  const downloadJSON = () => {
    var json = canvas.toJSON()
    console.log(json)

    var dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', 'data.json')

    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <editorFunctions.Provider
      value={{
        canvas,
        setCanvas,
        addRect,
        addCircle,
        addText,
        addImage,
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
      }}
    >
      {children}
    </editorFunctions.Provider>
  )
}
