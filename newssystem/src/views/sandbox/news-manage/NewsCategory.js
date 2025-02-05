import React, { useState, useEffect, useContext, useRef } from 'react'
import{ Button, Table, Modal, Form, Input} from 'antd'
import axios from 'axios' 
import {DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function NewsCategory() {
  // datasource也就是数据应当做成状态，因为我们的权限是动态改变的，根据不同的角色
  const [dataSource, setdataSource] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:5000/categories").then(res=>{
      setdataSource(res.data)
    })
  },[])

  const handleSave = (record) => {
    console.log(record)
    setdataSource(dataSource.map(item=>
      item.id === record.id ? {...item, ...record} : item)) /* 两个扩展符是合并，如果有相同属性后面替换前面 */
      axios.patch(`http://localhost:5000/categories/${record.id}`,{
        ...record
      })
  }

  const columns = [ /* 定义表格的列 */
    {
      title: 'ID',
      dataIndex: 'id', /* 表示会把name放到第一列中 对应上面datasource的属性 */
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave, /* 失去焦点回调handlesave，这里antd组件自动传递参数 */
      }),
    },
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
    
          <Button danger shape="circle" icon={<DeleteOutlined />} 
          onClick={()=>confirmMethod(item)}
          />

        </div>
    ),},
  ];

 

  const confirmMethod = (item) => {
    confirm({
      title: '确认删除？',  // 对话框标题
      icon : <ExclamationCircleOutlined />,  // 对话框图标
      // content: 'Are you sure you want to proceed?',  // 对话框内容
      onOk() {  // 用户点击 "OK" 按钮时执行
        // console.log('Confirmed'); 
        deleteMethod(item) 
      },
      onCancel() {  // 用户点击 "Cancel" 按钮时执行
        // console.log('Cancelled');
      },
    });
  }
// 这里的item就是我们点击的那一行的数据 因为我们在columns中定义了render函数，所以这里的item就是render函数的形参
  const deleteMethod = (item) => {
    // console.log(item)
    // // 当前页面同步状态，同时删除服务端（后端）数据（不删后端，刷新又出来）
    setdataSource(dataSource.filter(data => data.id !== item.id))
    // 这是在过滤 判断当前dataid是否等于item.id，如果是的话就删除，否则保留
    axios.delete(`http://localhost:5000/categories/${item.id}`)
  }

  const EditableContext = React.createContext(null);
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}> {/* context是跨级通信对象 */}
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({ /* 必须要提供要求的值 */
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext); /* 这个hook可以直接访问到context上下文对象里面的值 */
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus(); /* 编辑状态为真就获取焦点 */
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ /* 核心业务逻辑 */
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingInlineEnd: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

    

  return (
    <div>
      <Table dataSource={dataSource} 
      columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }} 
      rowKey={item=>item.id} 
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}/> {/* 分页 控制一页只有五行数据 */}
      </div> /* rowKey 数据源需要有一个primary key一样的东西，保证每个item的这个key不同，这是寻数据的依据 */
   ) 
  
}

/* 要实现修改一个category(antd 可编辑单元格)，整个系统跟着改变 */