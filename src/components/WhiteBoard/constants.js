import imageConstants from "../../Constants/imageConstants";

export const drawingMode = {
  RECTANGLE: "RECTANGLE",
  ELLIPSE: "ELLIPSE",
  TRIANGLE: "TRIANGLE",
  LINE: "LINE",
  ERASER: "ERASER",
};

export const defaultRectOptions = {
  strokeWidth: 2,
  stroke: "black",
  fill: "transparent",
  strokeUniform: true,
  noScaleCache: false,
  objectCaching: false,
};

export const defaultEllipseOptions = {
  strokeWidth: 2,
  stroke: "black",
  fill: "black",
  strokeUniform: true,
  noScaleCache: false,
};

export const defaultTriangleOptions = {
  strokeWidth: 2,
  stroke: "black",
  fill: "black",
  strokeUniform: true,
  noScaleCache: false,
};

export const defaultLineOptions = {
  strokeWidth: 2,
  stroke: "black",
  fill: "black",
  strokeUniform: true,
  noScaleCache: false,
};

export const tools = [
  { title: "Floorbeam", imgSrc: imageConstants.floorbeam },
  { title: "Diaphragms", imgSrc: imageConstants.diaphragms },
  { title: "Support", imgSrc: imageConstants.support },
  { title: "Subfloor", imgSrc: imageConstants.subfloor },
  { title: "Angel", imgSrc: imageConstants.angel },
  { separator: true },
  { title: "Bent", imgSrc: imageConstants.bent },
  { title: "Bridge Abutment", imgSrc: imageConstants.bridgeAbutment },
  { title: "Drilled Shaft", imgSrc: imageConstants.drilledShaft },
  { title: "Footing", imgSrc: imageConstants.footing },
  { title: "Foundation", imgSrc: imageConstants.foundation },
  { title: "Pier", imgSrc: imageConstants.pier },
  { title: "Pile", imgSrc: imageConstants.pile },
  { title: "Retaining Wall", imgSrc: imageConstants.retainingWall },
  { title: "Structure Type", imgSrc: imageConstants.structureType },
  { title: "Wing Wall", imgSrc: imageConstants.wingWall },
  { separator: true },
  { title: "Dampers", imgSrc: imageConstants.dampers },
  { title: "Electrical System", imgSrc: imageConstants.electricalSystem },
  { title: "Fuel Oil System", imgSrc: imageConstants.fuelOilSystem },
  {
    title: "Interior Construction",
    imgSrc: imageConstants.interiorConstruction,
  },
  { title: "Mechanical System", imgSrc: imageConstants.mechanicalSystem },
  { title: "Plumbing System", imgSrc: imageConstants.plumbingSystem },
  { title: "Sprinkler System", imgSrc: imageConstants.sprinklerSystem },
  { title: "Standpipe System", imgSrc: imageConstants.standpipeSystem },
];
