import { configureStore } from "@reduxjs/toolkit";
import configurationSlice from "./slices/configurationSlice";
import annotationSlice from "./slices/annotationSlice";
import projectSlice from "./slices/projectSlice";

export default configureStore({
  reducer: {
    annotations: annotationSlice,
    configurations: configurationSlice,
    project: projectSlice,
  },
});
