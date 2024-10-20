// @ts-nocheck
import AnnotationModal from '../AnnotationModal'
import Loader from '../Loader'
import PdfCanvasButtons from './PdfCanvasButtons'
import { RootState } from '@/store'
import { isFilePdf } from '@/utils'
import { useTour } from '@reactour/tour'
import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { useSelector } from 'react-redux'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

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
  const getPageNumberFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('pageNumber'), 10) || 1; // Default to 1 if not provided
  };

  useEffect(() => {
    const pageNumber = getPageNumberFromQuery();
    editor.setCurrPage(pageNumber);
  }, [location.search, editor]);

  const { setIsOpen, setSteps } = useTour()
  const isEditorTourCompleted =
    localStorage.getItem('editorTourCompleted')?.toString() === 'true'

  // Function to get the file extension
  function getFileExtension(url) {
    return url.split('.').pop().split(/\#|\?/)[0]
  }

  // const extension = getFileExtension(pick.fileUrl).toLowerCase()
  const isPdf = isFilePdf(pick.fileUrl)

  // Function for handling PDF load success
  function onDocumentLoadSuccess({
    numPages,
    originalHeight,
    originalWidth,
  }: any) {
    editor.setNumPages(numPages)
    // editor.setCurrPage(1)

    // Set max width and height
    const maxWidth = window.innerWidth * 0.8
    const maxHeight = window.innerHeight * 0.9

    // Calculate aspect ratio
    const aspectRatio = originalWidth / originalHeight

    // Calculate dimensions
    let width = maxWidth
    let height = width / aspectRatio

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    setPdfPageDimensions({ width, height })
    setPageDimensions({ width, height })
    editor.addPdfDimensions({ width, height })
    editor.setCanvas(initCanvas(width, height))

    // Store original dimensions
    editor.setOriginalPdfDimensions({ originalWidth, originalHeight })
  }

  // Function for handling image load success
  function onImageLoadSuccess(event) {
    const { naturalWidth, naturalHeight } = event.target

    // Set max width and height
    const maxWidth = window.innerWidth * 0.8
    const maxHeight = window.innerHeight * 0.9

    // Calculate aspect ratio
    const aspectRatio = naturalWidth / naturalHeight

    // Calculate dimensions
    let width = maxWidth
    let height = width / aspectRatio

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    setPdfPageDimensions({ width, height })
    setPageDimensions({ width, height })
    editor.addPdfDimensions({ width, height })
    editor.setCanvas(initCanvas(width, height))

    // Store original dimensions
    editor.setOriginalPdfDimensions({
      originalWidth: naturalWidth,
      originalHeight: naturalHeight,
    })

    // Since it's an image, set number of pages to 1
    editor.setNumPages(1)
    editor.setCurrPage(1)
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
              ? 'border-none bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)]'
              : 'border shadow-lg'
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

          {isPdf ? (
            // PDF Rendering
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
                          width: pageDimensions.width + 'px',
                          height: pageDimensions.height + 'px',
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
                          width={pageDimensions.width}
                          height={pageDimensions.height}
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
          ) : (
            // Image Rendering
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
                        width: pageDimensions.width + 'px',
                        height: pageDimensions.height + 'px',
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
                      id='imageWrapper'
                      className={`${
                        !editor.isExporting && editor.theme
                          ? 'border-none bg-[rgb(25,25,25)] shadow-[0px_0px_16px_rgb(0,0,0)]'
                          : 'border shadow-lg'
                      }`}
                    >
                      <img
                        src={pick.fileUrl}
                        onLoad={onImageLoadSuccess}
                        width={pageDimensions.width}
                        height={pageDimensions.height}
                        alt='Uploaded file'
                      />
                    </div>
                  </TransformComponent>
                  <PdfCanvasButtons
                    editor={editor}
                    changePage={changePage} // May need adjustment for images
                    pick={pick}
                    handleSaveAnnotations={handleSaveAnnotations}
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                    resetTransform={resetTransform}
                  />
                </>
              )}
            </TransformWrapper>
          )}
        </div>
      </div>
    </div>
  )
}

export default PdfCanvas
