import { Button, Input,Spin, Table } from "antd"
import {LinkedinOutlined} from "@ant-design/icons"
import React, { useState } from "react"
import { Helmet } from "react-helmet";
import { io } from "socket.io-client";
interface Iprops{

}
export const GetIndexex:React.FC<Iprops>=(props:Iprops)=>{
    const backendURL=process.env.REACT_APP_BACKEND_URL || "http://localhost:3333"
    const [url,setUrl]=useState<any>("")
    const [data,setData]=useState<Array<any>>([])
    const [page, setPage] = useState<number>(1);
    const [disable,setDisable]=useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(false)
    const columns = [
        {
            title:"Sno",
            key:"sno",
            render : (text:any, record:any, index:any) =>(page - 1) * 10 + index+1,
        },
        {
          title: 'IndexPages',
          key: 'IndexPages',
          render: (text:any) => <a>{text}</a>,
        },
      ];
      const socket = io(backendURL, { transports: ["websocket"] });   
      socket.on("url-links",(urls)=>{
          console.log(urls)
        setData((prevData:any)=>[...prevData,...urls])
      })
      socket.on('disconnect', ()=> {
        console.log("disconnected")
        setDisable(false)
        setLoading(false) 
    });
    const getData=async()=>{
        socket.emit("indexpages-url",url)
    }
    const getAllIndexpages=async()=>{
        setDisable(true)
        setLoading(true)
        await getData()
    }
    return(
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Index Checker: Get Index pages of the website</title>
                <meta name="description" content="Index Checker will helps you find out all the index pages of your blog or website easily with just your website name" />
            </Helmet>
            <a style={{float:"right"}} href={process.env.REACT_APP_LINKEDIN}><LinkedinOutlined  style={{ fontSize: '20px', color: '#08c' }}/></a>
            <h1 style={{textAlign:"center"}}><strong>Get Index pages of the website</strong></h1>
            <label>Enter URL :  </label>
            <Input style={{width:"70%"}} placeholder="http or https://example.com" value={url} disabled={disable} onChange={(e:any)=>{
                setUrl(e.target.value)
            }} /><br />
            <Button style={{textAlign:"center"}} type="primary" size="small" disabled={disable}  onClick={getAllIndexpages}>Click here !!</Button>
            {loading&&<Spin />}
            <div >
            <Table columns={columns} dataSource={data}  ></Table>
            </div>
        </div>
    )
}