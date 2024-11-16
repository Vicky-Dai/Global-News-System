import { PageHeader } from '@ant-design/pro-components'
import { Button, Descriptions } from 'antd'
import React, {useEffect, useParams } from 'react'

export default function NewsPreview(props) {
  // const { id } = useParams();

  useEffect(()=>{
    // console.log("NewsPreview组件挂载")
    console.log("props",props)
    return ()=>{
      // console.log("NewsPreview组件卸载")
    }
  },[])
  return (
    <div>
        <PageHeader
          // ghost={false}
          onBack={() => window.history.back()}
          title="Title"
          subTitle="This is a subtitle"
          // extra={[
          //   <Button key="3">Operation</Button>,
          //   <Button key="2">Operation</Button>,
          //   <Button key="1" type="primary">
          //     Primary
          //   </Button>,
          // ]}
        >
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="创建者">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="创建事件">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="发布时间">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="区域">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="审核状态">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="发布状态">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="访问数量">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="点赞数量">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="评论数量">Lili Qu</Descriptions.Item>
            
          </Descriptions>
        </PageHeader>
    </div>
  )
}
