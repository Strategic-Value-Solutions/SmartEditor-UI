// @ts-nocheck
import AnnotationModal from '../AnnotationModal'
import Loader from '../Loader'
import PdfCanvasButtons from './PdfCanvasButtons'
import { editorSteps } from '@/Tours/constants'
import { RootState } from '@/store'
import { useTour } from '@reactour/tour'
import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { useSelector } from 'react-redux'
import { Rnd } from 'react-rnd'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

// Import react-rnd

function PdfCanvas({
  editor,
  isDocLoading,
  pageDimensions,
  changePage,
  setPageDimensions,
  initCanvas,
  setIsDocLoading,
  pick,
  handleSaveAnnotations,
}: any) {
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const [pdfPageDimensions, setPdfPageDimensions] = useState({
    width: 0,
    height: 0,
  })
  const { setIsOpen, setSteps } = useTour()
  const isEditorTourCompleted =
    localStorage.getItem('editorTourCompleted')?.toString() === 'true'

  function onDocumentLoadSuccess({
    numPages,
    originalHeight,
    originalWidth,
  }: any) {
    editor.setNumPages(numPages)
    editor.setCurrPage(1)

    // Set max width to 80% of the window's width
    const maxWidth = window.innerWidth * 0.8
    // Set max height to 90% of the window's height
    const maxHeight = window.innerHeight * 0.9

    // Calculate aspect ratio of the original document
    const aspectRatio = originalWidth / originalHeight

    // Set width to maxWidth, and calculate height based on the aspect ratio
    let width = maxWidth
    let height = width / aspectRatio

    // If the calculated height is more than maxHeight, adjust the width accordingly
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    setPdfPageDimensions({ width, height })
    setPageDimensions({ width, height })
    editor.addPdfDimensions({ width, height }) // Adds displayed dimensions to editor
    editor.setCanvas(initCanvas(width, height))

    // Store both original and displayed dimensions in the editor
    editor.setOriginalPdfDimensions({ originalWidth, originalHeight })
  }

  return (
    <div
      className={`flex flex-col mx-auto items-center justify-center w-full ${
        editor.theme ? 'bg-[rgb(20,20,20)] text-white' : 'bg-white text-black'
      }`}
      style={{
        minHeight: '100vh',
        paddingTop: '20px',
        boxSizing: 'border-box',
      }}
    >
      <AnnotationModal>
        <div className='flex items-center justify-center'></div>
      </AnnotationModal>
      <div
        className={`flex items-center justify-center ${
          editor.theme ? 'bg-[rgb(20,20,20)] text-white' : 'bg-white text-black'
        }`}
      >
        <div
          id='singlePageExport'
          className={`relative flex items-center justify-center ${
            editor.theme
              ? 'bg-[rgb(20,20,20)] text-white'
              : 'bg-white text-black'
          }`}
          style={{
            maxWidth: '100%',
          }}
        >
          {isDocLoading && (
            <>
              <div className='fixed top-0 z-[1001] h-full w-full bg-[rgba(50,50,50,0.2)] backdrop-blur-sm'></div>
              <div className='fixed top-0 z-[1100] flex h-full w-full items-center justify-center'>
                <Loader />
              </div>
            </>
          )}

          <Document
            file={pick.fileUrl}
            onLoadSuccess={(pdf) =>
              pdf.getPage(editor.currPage).then((page) =>
                onDocumentLoadSuccess({
                  numPages: pdf.numPages,
                  originalHeight: page.view[3],
                  originalWidth: page.view[2],
                })
              )
            }
            className='flex justify-center mb-20'
            id='doc'
          >
            <TransformWrapper
              initialScale={1}
              wheel={{ disabled: !editor.allowPinchZoom }}
              pinch={{ disabled: !editor.allowPinchZoom }}
              panning={{ disabled: !editor.allowPinchZoom }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent>
                    <div
                      className='absolute z-[9]'
                      id='canvasWrapper'
                      style={{
                        visibility: 'visible',
                        width: pageDimensions.width + 'px', // Match canvas width to PDF
                        height: pageDimensions.height + 'px', // Match canvas height to PDF
                        top: 0,
                        left: 0,
                      }}
                    >
                      <canvas
                        id='canvas'
                        width={pageDimensions.width}
                        height={pageDimensions.height}
                      />
                    </div>
                    <div
                      id='pdfWrapper'
                      className={`${
                        !editor.isExporting && editor.theme
                          ? 'border-none bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)]'
                          : 'border shadow-lg'
                      }`}
                    >
                      <Page
                        pageNumber={editor.currPage}
                        width={pageDimensions.width} // Match PDF width
                        height={pageDimensions.height} // Match PDF height
                      />
                    </div>
                  </TransformComponent>
                  <PdfCanvasButtons
                    editor={editor}
                    changePage={changePage}
                    pick={pick}
                    handleSaveAnnotations={handleSaveAnnotations}
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                    resetTransform={resetTransform}
                  />
                </>
              )}
            </TransformWrapper>
          </Document>
        </div>
      </div>
    </div>
  )
}

export default PdfCanvas
