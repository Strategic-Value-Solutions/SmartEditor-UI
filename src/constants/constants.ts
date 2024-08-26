import imageConstants from '@/constants/imageConstants'
import { pick } from 'node_modules/fabric/dist/src/util'

export const drawingMode = {
  RECTANGLE: 'RECTANGLE',
  ELLIPSE: 'ELLIPSE',
  TRIANGLE: 'TRIANGLE',
  LINE: 'LINE',
  ERASER: 'ERASER',
}

export const defaultRectOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'transparent',
  strokeUniform: true,
  noScaleCache: false,
  objectCaching: false,
}

export const defaultEllipseOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false,
}

export const defaultTriangleOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false,
}

export const defaultLineOptions = {
  strokeWidth: 2,
  stroke: 'black',
  fill: 'black',
  strokeUniform: true,
  noScaleCache: false,
}

export const tools = [
  { title: 'Floorbeam', imgSrc: imageConstants.floorbeam, pickName: 'Pick 1' },
  { title: 'Diaphragms', imgSrc: imageConstants.diaphragms, pickName: 'Pick 1' },
  { title: 'Support', imgSrc: imageConstants.support, pickName: 'Pick 1' },
  { title: 'Subfloor', imgSrc: imageConstants.subfloor, pickName: 'Pick 1' },
  { title: 'Angel', imgSrc: imageConstants.angel, pickName: 'Pick 2' },
  // { separator: true },
  { title: 'Bent', imgSrc: imageConstants.bent, pickName: 'Pick 2' },
  { title: 'Bridge Abutment', imgSrc: imageConstants.bridgeAbutment ,pickName: 'Pick 2' },
  { title: 'Drilled Shaft', imgSrc: imageConstants.drilledShaft, pickName: 'Pick 2' },
  { title: 'Footing', imgSrc: imageConstants.footing,pickName:'Pick 3' },
  { title: 'Foundation', imgSrc: imageConstants.foundation, pickName: 'Pick 3' },
  { title: 'Pier', imgSrc: imageConstants.pier, pickName: 'Pick 3'  },
  { title: 'Pile', imgSrc: imageConstants.pile, pickName: 'Pick 3'  },
  { title: 'Retaining Wall', imgSrc: imageConstants.retainingWall, pickName: 'Pick 4'  },
  { title: 'Structure Type', imgSrc: imageConstants.structureType,pickName: 'Pick 4' },
  { title: 'Wing Wall', imgSrc: imageConstants.wingWall,pickName: 'Pick 4' },
  // { separator: true },
  { title: 'Dampers', imgSrc: imageConstants.dampers,pickName: 'Pick 5' },
  { title: 'Electrical System', imgSrc: imageConstants.electricalSystem ,pickName: 'Pick 5'},
  { title: 'Fuel Oil System', imgSrc: imageConstants.fuelOilSystem,pickName: 'Pick 5' },
  {
    title: 'Interior Construction',
    imgSrc: imageConstants.interiorConstruction,
    pickName: 'Pick 5'
  },
  { title: 'Mechanical System', imgSrc: imageConstants.mechanicalSystem,pickName: 'Pick 6' },
  { title: 'Plumbing System', imgSrc: imageConstants.plumbingSystem ,pickName: 'Pick 6' },
  { title: 'Sprinkler System', imgSrc: imageConstants.sprinklerSystem,pickName: 'Pick 6' },
  { title: 'Standpipe System', imgSrc: imageConstants.standpipeSystem,pickName: 'Pick 6' },
]

export const ERROR_MESSAGE = 'Something went wrong. Please try again later.'
