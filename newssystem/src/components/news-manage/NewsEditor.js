import React, {useEffect, useState} from 'react'
import { Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';


export default function NewsEditor(props) {
  
  useEffect(()=>{
    // console.log(props.content)
    // html===>draft
    const html = props.content /* add和更新共用组件，需要一开始就把之前有的内容放进去 */
    if(html === undefined) return /* 如果没有传递content，直接返回 */
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks); /* 引入的组件的方法，去查draft docs */
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
    }
  }, [props.content]) /* useEffect检测到父组件传进来的属性值发生改变，触发运行，把父组件拿到的html数据再转换成draft对象 */
  
  /* 如果 NewsEditor 组件的父组件 NewsAdd 没有传递 content 作为 props，useEffect 钩子仍然会在组件首次渲染时执行，但由于 props.content 是 undefined，useEffect 钩子中的逻辑可能不会按预期执行。 */
  
  const [editorState, setEditorState] = useState("")
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div>
      <Editor
        editorState={editorState} /* 文本框中的内容 */
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        // editorState和onEditorStateChange可以帮助富文本编辑器变成一个可控组件，受到父组件控制（可以受到React影响）
        onBlur = {()=>{ /* 当失去焦点的时候，把当前的内容传递给父组件 */
          // console.log()
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent()))) /* props父组件方法，获取当前子组件的值 */
        } /*  失去焦点就是点击文本框以外的地方，触发onBlur函数 */
        }
      />;

    </div>
  )
}

// 这是从npm下载过来的富文本编辑器

/* 该NewsEditor组件作为子组件，可以被多个父组件使用，被两个父组件NewsAdd和NewsUpdate共用， */
/* NewsAdd 和 NewsUpdate 作为 NewsEditor 的父组件，通过 props 向 NewsEditor 组件传递 content 和 getContent 回调函数。 会报错。React 会根据传递的 props 更新 NewsEditor 组件的状态。NewsEditor 组件会根据接收到的 props.content 更新其内部的 editorState。*/