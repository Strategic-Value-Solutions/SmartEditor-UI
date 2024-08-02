// @ts-nocheck

import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import styles from './index.module.scss'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const PDFReader = ({ fileReaderInfo, updateFileReaderInfo, setTotalPages }) => {
  function onRenderSuccess() {
    const importPDFCanvas = document.querySelector('.import-pdf-page canvas')
    const pdfAsImageSrc = importPDFCanvas.toDataURL()

    updateFileReaderInfo({ currentPage: pdfAsImageSrc })
  }

  function onDocumentLoadSuccess({ numPages }) {
    updateFileReaderInfo({ totalPages: numPages })
  }

  function changePage(offset) {
    updateFileReaderInfo({
      currentPageNumber: fileReaderInfo.currentPageNumber + offset,
    })
  }

  const nextPage = () => changePage(1)
  const previousPage = () => changePage(-1)

  return (
    <div className={styles.pdfReader}>
      <div className={styles.fileContainer}>
        <Document
          className={styles.document}
          file={fileReaderInfo?.file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            console.log('Loading a document: ' + (loaded / total) * 100 + '%')
          }
        >
          <Page
            className='import-pdf-page'
            onRenderSuccess={onRenderSuccess}
            pageNumber={fileReaderInfo?.currentPageNumber || 1}
          />
        </Document>
      </div>
      {/* <div className={styles.pageInfo}>
        <span>
          Page {fileReaderInfo.currentPageNumber} of {fileReaderInfo.totalPages || '--'}
        </span>
        <button
          type="button"
          disabled={fileReaderInfo.currentPageNumber <= 1}
          onClick={previousPage}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={fileReaderInfo.currentPageNumber >= fileReaderInfo.totalPages}
          onClick={nextPage}
        >
          Next
        </button>
      </div> */}
    </div>
  )
}

export default PDFReader
