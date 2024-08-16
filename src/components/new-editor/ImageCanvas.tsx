// @ts-nocheck
import Loader from './Loader'
import * as fabric from 'fabric'
import React, { useEffect } from 'react'

function ImageCanvas({ selectedFile, isDocLoading, initCanvas }) {
  useEffect(() => {
    // Initialize the canvas
    const canvas = initCanvas()

    const img = new Image()
    img.onload = function () {
      // Add image to the canvas
      const fabricImg = new fabric.Image(img, {
        selectable: false, // Ensure the image itself is not selectable
        evented: false, // The image won't trigger events like selection
      })

      // Set the image as the background of the canvas
      canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      })

      // Render the canvas
      canvas.renderAll()
    }

    img.src = URL.createObjectURL(selectedFile)

    // Clean up on component unmount
    return () => {
      canvas.dispose()
    }
  }, [selectedFile, initCanvas])

  if (isDocLoading) {
    alert('Loading...')
  }

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {isDocLoading && <Loader color={'#606060'} size={120} stokeWidth={'5'} />}
      {!isDocLoading && <canvas id='canvas' />}
    </div>
  )
}

export default ImageCanvas
