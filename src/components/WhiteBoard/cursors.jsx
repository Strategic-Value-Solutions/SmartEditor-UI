import imageConstants from "../../Constants/imageConstants";
const getCursor = ({ type }) => {
  switch (type) {
    case "eraser": {
      return imageConstants.removeCursor;
    }

    default: {
      return "";
    }
  }
};

export default getCursor;
