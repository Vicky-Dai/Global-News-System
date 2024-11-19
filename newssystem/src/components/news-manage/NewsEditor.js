import React, {useEffect, useState} from 'react'
import { Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


export default function NewsEditor(props) {
  // const [editorState, seteditorState] = useState("second")
  // const onEditorStateChange = (editorState) => {
  //   seteditorState(editorState)
  // }
  useEffect(()=>{
    // console.log(props.content)
    // html===>draft
    
  })
  const [editorState, setEditorState] = useState("")

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }
  

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        editorState和onEditorStateChange可以帮助富文本编辑器变成一个可控组件
        onBlur = {()=>{
          console.log()
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
        }
      />;

    </div>
  )
}

// 这是从npm下载过来的富文本编辑器