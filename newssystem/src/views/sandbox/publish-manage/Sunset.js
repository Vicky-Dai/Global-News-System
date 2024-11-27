import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublished.js'
import usePublish from '../../../components/publish-manage/usePublish.js'
import { Button } from 'antd'

export default function Sunset() {
  const {dataSource,handleDelete} = usePublish(3) /* 3是已下线的 */
  
  return (
    <div>
      <NewsPublish dataSource = {dataSource} button={(id)=><Button danger 
      onClick={()=>handleDelete(id)}>
        删除
      </Button>}> </NewsPublish>
    </div>
  )
}