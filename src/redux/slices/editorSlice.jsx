import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  editorContent: "",
};

const editorSlice = createSlice({
  name: "editor",
  initialState: initialState,
  reducers: {
    setEditorContent: (state, action) => {
      state.editorContent = action.payload;
    },
  },
});

export const { setEditorContent } = editorSlice.actions;

export default editorSlice;
