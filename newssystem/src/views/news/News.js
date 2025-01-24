import { PageHeader } from '@ant-design/pro-components'
import { Card, Col, List, Row } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'

export default function News() {
  const [data, setdata] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/news?publishState=2&_embed=category").then(res => {
      setdata(Object.entries(_.groupBy(res.data, item => item.category.title))) // Object.entries转二维数组
      console.log("data", Object.entries(_.groupBy(res.data, item => item.category.title)))
    })
  }, [])

  return (
    <div style={{
      width: "95%",
      margin: "0 auto"
    }}>
      <PageHeader
        className="site-page-header"
        title="全球新闻"
      />

      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {
            data?.map(([category, news]) => { // 解构每个分类
              return (
                <Col span={8} key={category}> {/* 使用分类标题作为key */}
                  <Card title={category} bordered={true} hoverable={true}>
                    <List
                      size="small"
                      header={<div>{category}</div>} // 分类标题作为Header
                    //   footer={<div>Footer</div>}
                      bordered
                      dataSource={news} // 使用news数组作为List的dataSource
                      pagination={{
                        pageSize: 3,
                      }}
                      renderItem={(newsItem) => (
                        <List.Item><a href={`/detail/${data.id}`}>{newsItem.title}</a></List.Item> // 渲染新闻的标题
                      )}
                    />
                  </Card>
                </Col>
              );
            })
          }
        </Row>
      </div>
    </div>
  )
}

/* JavaScript 中的箭头函数如果没有显式的 return 语句，它是不会自动返回 JSX 内容的。 */