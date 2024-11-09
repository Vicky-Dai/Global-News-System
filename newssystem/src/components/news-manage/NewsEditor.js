import React, {useState} from 'react'
import { Editor} from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor() {
  // const [editorState, seteditorState] = useState("second")
  // const onEditorStateChange = (editorState) => {
  //   seteditorState(editorState)
  // }
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div>
      <Editor
        // editorState={editorState}
        // toolbarClassName="toolbarClassName"
        // wrapperClassName="wrapperClassName"
        // editorClassName="editorClassName"
        // onEditorStateChange={onEditorStateChange}
        // editorState和onEditorStateChange可以帮助富文本编辑器变成一个可控组件
      />;

    </div>
  )
}
