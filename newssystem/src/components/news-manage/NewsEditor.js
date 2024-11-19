import React, {useEffect, useState} from 'react'
import { Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';


export default function NewsEditor(props) {
  // const [editorState, seteditorState] = useState("second")
  // const onEditorStateChange = (editorState) => {
  //   seteditorState(editorState)
  // }  这是原先没有更新功能的时候的定义，更新的时候直接从draft-js中获取
  useEffect(()=>{
    // console.log(props.content)
    // html===>draft
    const html = props.content /* add和更新共用组件，需要一开始就把之前有的内容放进去 */
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
    }
  }, [props.content])
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
        // editorState和onEditorStateChange可以帮助富文本编辑器变成一个可控组件，受到父组件控制（可以受到React影响）
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