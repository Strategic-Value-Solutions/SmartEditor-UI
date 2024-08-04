import React from "react";
import imageConstants from "../../../Constants/imageConstants";
import { tools } from "../constants";
import styles from "../index.module.scss";

function ExtendedToolbar({
  canvas,
  showExtendedToolbar,
  toggleExtendedToolbar,
  createRect,
  fileReaderInfo,
}) {
  return (
    <div
      className={`${styles.extendedToolbar} ${
        showExtendedToolbar ? styles.show : ""
      }`}
    >
      {tools.map((button, index) =>
        button.separator ? (
          <img key={index} src={imageConstants.separator} alt="separator" />
        ) : (
          <button
            key={index}
            type="button"
            title={button.title}
            onClick={() => createRect(canvas, button.imgSrc, fileReaderInfo)}
          >
            <img src={button.imgSrc} alt={button.title.toLowerCase()} />
          </button>
        )
      )}
      <button type="button" onClick={() => toggleExtendedToolbar()}>
        <img src={imageConstants.close} alt="close" />
      </button>
    </div>
  );
}

export default ExtendedToolbar;
