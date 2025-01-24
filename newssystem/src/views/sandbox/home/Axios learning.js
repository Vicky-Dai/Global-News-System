// /* 注意二级取值写法 */
//   const ajax =() =>{
//    /* 查数据 */
//   //   axios.get('http://localhost:8000/posts/1').then(res => {
//   //     console.log(res.data)
//   // }) /* json server按照rest格式定义 */

//   /* 增数据 */
//     // axios.post('http://localhost:8000/posts',{  /* 注意一定是http不是https */
//     //   title: 'test', /* id自动生成 自增长*/
//     //   author: "mimi"
//     // })  /* 按照restful规范 增加数据 */

//     /* put替换修改数据 */
//     // axios.put("http://localhost:8000/posts/1",{
//     //   title:'1111-修改' /* put会把没修改的都删掉 */
//     // })

//     /* patch 补丁修改 */
//     // axios.patch("http://localhost:8000/posts/1",{
//     //   title:"love u data change 补丁"
//     // })

//     /* 删除数据 delete*/
//     // axios.delete("http://localhost:8000/posts/1")

//     //_embed 连接数据
//     // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
//     //   console.log(res.data)
//     // }) 
//     /* ?_embed=comments 连接posts和comments 让comments里面postID==id的取出 对应好id一起放在posts里面  */
//     /* comments这些都是接口的名字 */
//     /* jsonserver向下表关联 */

//     // _expand 向上关联 比如：从comments找到新闻相关信息
//     // axios.get("http://localhost:8000/rights?_expand=post").then(res=>{ /* posts postId post 这里用到关联名称是接口固定的 */
//     //   console.log(res.data)
//     // })
//   }