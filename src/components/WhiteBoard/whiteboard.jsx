import { fabric } from "fabric";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAnnotation,
  removeAnnotation,
  setAnnotationsForPage,
  setProjectSettings,
  clearAnnotations,
} from "../../redux/slices/annotationSlice";
import PdfReader from "../PdfReader/PdfReader";
import ExtendedToolbar from "./components/ExtendedToolbar.jsx";
import Toolbar from "./components/Toolbar.jsx";
import UploadModal from "./components/UploadModal.jsx";
import getCursor from "./cursors.jsx";
import "./eraserBrush.jsx";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";

let drawInstance = null;
let origX;
let origY = 0;
let mouseDown = false;

const options = {
  currentMode: "",
  currentColor: "red",
  currentWidth: 1,
  fill: false,
  group: {},
};

const modes = {
  RECTANGLE: "RECTANGLE",
  TRIANGLE: "TRIANGLE",
  ELLIPSE: "ELLIPSE",
  LINE: "LINE",
  PENCIL: "PENCIL",
  ERASER: "ERASER",
};

const initCanvas = (width, height) => {
  const canvas = new fabric.Canvas("canvas", { height, width });
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = "circle";
  fabric.Object.prototype.borderColor = "#4447A9";
  fabric.Object.prototype.cornerColor = "#4447A9";
  fabric.Object.prototype.cornerSize = 6;
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderDashArray = [5, 5];

  return canvas;
};

function removeObject(canvas, dispatch, projectId, pageNumber) {
  return (e) => {
    if (options.currentMode === modes.ERASER) {
      const target = e.target;
      canvas.remove(target);
      dispatch(
        removeAnnotation({
          projectId,
          pageNumber,
          objectId: target._id,
        })
      );
    }
  };
}

function stopDrawing() {
  mouseDown = false;
}

function removeCanvasListener(canvas) {
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
}

/* ==== rectangle ==== */
function createRect(canvas, icn, fileReaderInfo, dispatch, projectId) {
  removeCanvasListener(canvas);
  console.log(projectId, "projectId");
  canvas.on(
    "mouse:down",
    startAddRect(canvas, icn, fileReaderInfo, dispatch, projectId)
  );
  canvas.on("mouse:move", startDrawingRect(canvas));
  canvas.on("mouse:up", stopDrawing);

  canvas.selection = false;
  canvas.hoverCursor = "auto";
  canvas.isDrawingMode = false;
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddRect(canvas, icn, fileReaderInfo, dispatch, projectId) {
  return ({ e }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;

    fabric.Image.fromURL(icn, (img) => {
      img.set({
        left: origX,
        top: origY,
        selectable: false,
        scaleX: 1,
        scaleY: 1,
      });

      img._id = uuidv4(); // Set a unique id for the object

      canvas.add(img);

      img.on(
        "mousedown",
        removeObject(
          canvas,
          dispatch,
          projectId,
          fileReaderInfo.currentPageNumber
        )
      );

      dispatch(
        addAnnotation({
          projectId,
          pageNumber: fileReaderInfo.currentPageNumber,
          object: img.toObject(), // Convert to plain object before dispatching
        })
      );
    });

    drawInstance = new fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : "transparent",
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    drawInstance._id = uuidv4(); // Set a unique id for the object

    canvas.add(drawInstance);

    drawInstance.on(
      "mousedown",
      removeObject(
        canvas,
        dispatch,
        projectId,
        fileReaderInfo.currentPageNumber
      )
    );

    dispatch(
      addAnnotation({
        projectId,
        pageNumber: fileReaderInfo.currentPageNumber,
        object: drawInstance.toObject(), // Convert to plain object before dispatching
      })
    );
  };
}

function startDrawingRect(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set("left", pointer.x);
      }
      if (pointer.y < origY) {
        drawInstance.set("top", pointer.y);
      }
      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY),
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

function createText(canvas, fileReaderInfo, dispatch, projectId) {
  removeCanvasListener(canvas);

  canvas.isDrawingMode = false;

  const text = new fabric.Textbox("text", {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true,
  });

  text._id = uuidv4(); // Set a unique id for the object

  canvas.add(text);
  canvas.renderAll();

  text.on(
    "mousedown",
    removeObject(canvas, dispatch, projectId, fileReaderInfo.currentPageNumber)
  );

  dispatch(
    addAnnotation({
      projectId,
      pageNumber: fileReaderInfo.currentPageNumber,
      object: text.toObject(), // Convert to plain object before dispatching
    })
  );
}

function changeToErasingMode(canvas, dispatch, projectId, pageNumber) {
  console.log("changeToErasingMode", options.currentMode);
  removeCanvasListener(canvas);

  canvas.isDrawingMode = false;

  options.currentMode = modes.ERASER;
  canvas.hoverCursor = `url(${getCursor({ type: "eraser" })}), default`;

  canvas.getObjects().forEach((obj) => {
    obj.on("mousedown", removeObject(canvas, dispatch, projectId, pageNumber));
  });
}

function onSelectMode(canvas, dispatch, projectId, pageNumber) {
  options.currentMode = "";
  canvas.isDrawingMode = false;

  removeCanvasListener(canvas);

  canvas.getObjects().forEach((item) => {
    item.set({ selectable: true });
  });

  // Dispatch an action to update all objects in the state
  dispatch(
    setAnnotationsForPage({
      projectId,
      pageNumber,
      objects: canvas.getObjects().map((obj) => obj.toObject()),
    })
  );

  canvas.hoverCursor = "all-scroll";
}

function clearCanvas(canvas, dispatch, projectId, pageNumber) {
  canvas.getObjects().forEach((item) => {
    dispatch(removeAnnotation({ projectId, pageNumber, objectId: item._id }));
    canvas.remove(item);
  });

  // Dispatch an action to clear all annotations for the page
  dispatch(clearAnnotations({ projectId, pageNumber }));
}

function canvasToJson(canvas) {
  const json = JSON.stringify(canvas.toJSON());
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "canvas.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleResize(callback) {
  const resize_ob = new ResizeObserver(callback);

  return resize_ob;
}

function resizeCanvas(canvas, whiteboard) {
  return () => {
    const ratio = canvas.getWidth() / canvas.getHeight();
    const whiteboardWidth = whiteboard.clientWidth;

    const scale = whiteboardWidth / canvas.getWidth();
    const zoom = canvas.getZoom() * scale;
    canvas.setDimensions({
      width: whiteboardWidth,
      height: whiteboardWidth / ratio,
    });
    canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  };
}

function filterObjectsByPage(
  canvas,
  pageNumber,
  projectAnnotations,
  projectId
) {
  canvas.getObjects().forEach((obj) => {
    obj.set({ visible: false });
  });

  if (
    projectAnnotations[projectId] &&
    projectAnnotations[projectId][pageNumber]
  ) {
    const objects = projectAnnotations[projectId][pageNumber];
    fabric.util.enlivenObjects(objects, (enlivenedObjects) => {
      enlivenedObjects.forEach((enlivenedObj) => {
        enlivenedObj.set({ visible: true });
        canvas.add(enlivenedObj);
      });
      canvas.renderAll();
    });
  }
}

const Whiteboard = ({
  aspectRatio = 4 / 3,
  fileReaderInfo,
  updateFileReaderInfo,
}) => {
  const dispatch = useDispatch();
  const projectAnnotations = useSelector(
    (state) => state.annotations.projectAnnotations
  );
  const projectSettings = useSelector(
    (state) => state.annotations.projectSettings
  );
  const currentProject = useSelector((state) => state.project.currentProject);

  console.log(projectAnnotations, "projectAnnotations");
  console.log(projectSettings, "projectSettings");
  console.log(currentProject, "currentProject");

  const [canvas, setCanvas] = useState(null);
  const [brushWidth, setBrushWidth] = useState(1);
  const [isFill, setIsFill] = useState(false);
  const canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const uploadImageRef = useRef(null);
  const uploadPdfRef = useRef(null);
  const [showExtendedToolbar, setShowExtendedToolbar] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [pickNumber, setPickNumber] = useState("");
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  useEffect(() => {
    if (!canvas && canvasRef.current) {
      const canvas = initCanvas(
        whiteboardRef.current.clientWidth,
        whiteboardRef.current.clientWidth / aspectRatio
      );
      setCanvas(() => canvas);

      handleResize(resizeCanvas(canvas, whiteboardRef.current)).observe(
        whiteboardRef.current
      );
      setIsOpen(true);
    }
  }, [canvas, canvasRef]);

  useEffect(() => {
    if (
      canvas &&
      fileReaderInfo.currentPageNumber !== undefined &&
      currentProject
    ) {
      filterObjectsByPage(
        canvas,
        fileReaderInfo.currentPageNumber,
        projectAnnotations,
        currentProject._id
      );
    }
  }, [
    fileReaderInfo.currentPageNumber,
    canvas,
    projectAnnotations,
    currentProject,
  ]);

  useEffect(() => {
    if (canvas && fileReaderInfo.currentPage && currentProject) {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileReaderInfo?.currentPage, (img) => {
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: "center",
          originY: "center",
        });

        canvas.renderAll();
      });
    }
  }, [fileReaderInfo?.currentPage, currentProject]);

  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.addEventListener("load", () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToHeight(canvas.height);
        canvas.add(img);
        dispatch(
          addAnnotation({
            projectId: currentProject._id,
            pageNumber: fileReaderInfo.currentPageNumber,
            object: img.toObject(), // Convert to plain object before dispatching
          })
        );
      });
    });

    reader.readAsDataURL(file);
  }

  function changeCurrentWidth(e) {
    const intValue = parseInt(e.target.value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setBrushWidth(() => intValue);
  }

  function changeCurrentColor(e) {
    options.currentColor = e.target.value;
    canvas.freeDrawingBrush.color = e.target.value;
  }

  function changeFill(e) {
    options.fill = e.target.checked;
    setIsFill(() => e.target.checked);
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      saveAs(blob, `project1_image.png`);
    });
  }

  function onFileChange(event) {
    const file = event.target.files[0];
    updateFileReaderInfo({ file, currentPageNumber: 1 });
    setIsPdfLoaded(false);
  }

  function toggleExtendedToolbar() {
    setShowExtendedToolbar((prev) => !prev);
  }

  return (
    <div ref={whiteboardRef} className={styles.whiteboard}>
      <canvas ref={canvasRef} id="canvas" />
      <UploadModal
        uploadImageRef={uploadImageRef}
        uploadPdfRef={uploadPdfRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        projectId={currentProject?._id}
        pickNumber={pickNumber}
        setPickNumber={setPickNumber}
        uploadImage={uploadImage}
        onFileChange={onFileChange}
      />

      <ExtendedToolbar
        canvas={canvas}
        showExtendedToolbar={showExtendedToolbar}
        toggleExtendedToolbar={toggleExtendedToolbar}
        createRect={(canvas, icn, fileReaderInfo) =>
          createRect(canvas, icn, fileReaderInfo, dispatch, currentProject?._id)
        }
        fileReaderInfo={fileReaderInfo}
      />
      <Toolbar
        canvas={canvas}
        uploadImageRef={uploadImageRef}
        uploadPdfRef={uploadPdfRef}
        pickNumber={pickNumber}
        uploadImage={uploadImage}
        onFileChange={onFileChange}
        onSaveCanvasAsImage={onSaveCanvasAsImage}
        toggleExtendedToolbar={toggleExtendedToolbar}
        onSelectMode={(canvas) =>
          onSelectMode(
            canvas,
            dispatch,
            currentProject?._id,
            fileReaderInfo.currentPageNumber
          )
        }
        createText={(canvas) =>
          createText(canvas, fileReaderInfo, dispatch, currentProject?._id)
        }
        changeToErasingMode={(canvas) =>
          changeToErasingMode(
            canvas,
            dispatch,
            currentProject?._id,
            fileReaderInfo.currentPageNumber
          )
        }
        clearCanvas={(canvas) =>
          clearCanvas(
            canvas,
            dispatch,
            currentProject?._id,
            fileReaderInfo.currentPageNumber
          )
        }
        canvasToJson={canvasToJson}
      />

      <div>
        <PdfReader
          setIsPdfLoaded={setIsPdfLoaded}
          fileReaderInfo={fileReaderInfo}
          updateFileReaderInfo={updateFileReaderInfo}
        />
      </div>
    </div>
  );
};

Whiteboard.propTypes = {
  aspectRatio: PropTypes.number,
  fileReaderInfo: PropTypes.object,
  updateFileReaderInfo: PropTypes.func,
};

export default Whiteboard;
