function changeCurrentWidth(e) {
  const intValue = parseInt(e.target.value)
  options.currentWidth = intValue
  canvas.freeDrawingBrush.width = intValue
  setBrushWidth(() => intValue)
}

function changeCurrentColor(e) {
  options.currentColor = e.target.value
  canvas.freeDrawingBrush.color = e.target.value
}

function changeFill(e) {
  options.fill = e.target.checked
  setIsFill(() => e.target.checked)
}
