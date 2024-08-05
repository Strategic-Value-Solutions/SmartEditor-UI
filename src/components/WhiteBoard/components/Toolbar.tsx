// @ts-nocheck
import React, { useEffect, useRef } from 'react'
import styles from '../index.module.scss'
import imageConstants from '@/constants/imageConstants'

const Toolbar = ({
  canvas,
  uploadImageRef,
  uploadPdfRef,
  pickNumber,
  uploadImage,
  onFileChange,
  onSaveCanvasAsImage,
  toggleExtendedToolbar,
  onSelectMode,
  createText,
  changeToErasingMode,
  clearCanvas,
  canvasToJson,
}: any) => {
  const localUploadImageRef = useRef(null)
  const localUploadPdfRef = useRef(null)

  useEffect(() => {
    if (uploadImageRef) {
      uploadImageRef.current = localUploadImageRef.current
    }
    if (uploadPdfRef) {
      uploadPdfRef.current = localUploadPdfRef.current
    }
  }, [uploadImageRef, uploadPdfRef])

  const handleUploadImageClick = () => {
    if (localUploadImageRef.current) {
      localUploadImageRef?.current?.click()
    }
  }

  const handleUploadPdfClick = () => {
    if (localUploadPdfRef.current) {
      localUploadPdfRef?.current?.click()
    }
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.pickNumberDisplay}>
        <span className='toolbar-text'>{pickNumber}</span>
      </div>
      <button type='button' title='Move' onClick={() => onSelectMode(canvas)}>
        <img src={imageConstants.SelectIcon} alt='Selection mode' />
      </button>
      <button type='button' title='Text' onClick={() => createText(canvas)}>
        <img src={imageConstants.TextIcon} alt='Text' />
      </button>
      <img src={imageConstants.linebreak} alt='linebreak' />
      <button
        type='button'
        title='Eraser'
        onClick={() => changeToErasingMode(canvas)}
      >
        <img
          src={imageConstants.EraserIcon}
          alt='Eraser'
          style={{
            filter: 'invert(100%)',
          }}
        />
      </button>
      <button
        type='button'
        title='Annotate'
        onClick={() => toggleExtendedToolbar()}
      >
        <img src={imageConstants.RectangleIcon} alt='Rectangle' />
      </button>
      <button type='button' title='Clear' onClick={() => clearCanvas(canvas)}>
        <img
          src={imageConstants.DeleteIcon}
          alt='Delete'
          style={{
            filter: 'invert(100%)',
          }}
        />
      </button>
      <img src={imageConstants.linebreak} alt='linebreak' />
      <div className={styles.uploadDropdown}>
        <input
          ref={localUploadImageRef}
          accept='image/*'
          type='file'
          onChange={uploadImage}
          style={{ display: 'none' }}
        />
        <input
          ref={localUploadPdfRef}
          accept='.pdf'
          type='file'
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <button
          style={{
            color: 'white',
          }}
          className={styles.dropdownButton}
        >
          +Upload
        </button>
        <div className={styles.dropdownContent}>
          <span onClick={handleUploadImageClick}>Image</span>
          <span onClick={handleUploadPdfClick}>PDF</span>
        </div>
      </div>

      <button
        style={{
          color: 'white',
        }}
        onClick={() => canvasToJson(canvas)}
      >
        To Json
      </button>
      <button
        style={{
          color: 'white',
        }}
        onClick={onSaveCanvasAsImage}
      >
        Save as image
      </button>
    </div>
  )
}

export default Toolbar
