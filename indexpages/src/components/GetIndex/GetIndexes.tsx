import { Button, Input, message,Spin, Table } from "antd"
import {FacebookOutlined,LinkedinOutlined} from "@ant-design/icons"
import axios from "axios"
import React, { useState } from "react"
import { getWithExpiry, setWithExpiry } from "../utils/localStorageExpiry"
import { Helmet } from "react-helmet";
interface Iprops{

}
export const GetIndexex:React.FC<Iprops>=(props:Iprops)=>{
    const backendURL=process.env.REACT_APP_BACKEND_URL || "http://localhost:3333"
    const [url,setUrl]=useState<any>("")
    const [data,setData]=useState<any>([])
    const [page, setPage] = useState<number>(1);
    const [disable,setDisable]=useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(false)
    const localexpiry=21600000 
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
   
    const getData=async()=>{   
            axios.get(`${backendURL}/api/getAllUrls`,{
                headers:{
                    url:url
                }
            }).then(response=>{
                setData(response.data.payload)
                setWithExpiry(url,response.data.payload,localexpiry)
                setDisable(false)
                setLoading(false)
            }).catch(error=>{
                message.error("something went wrong")
                setDisable(false)
                setLoading(false)
            })
    }
    const getNoOfRecords=async()=>{
        axios.get(`${backendURL}/api/getNoOfRecords`,{
            headers:{
                url:url
            }
        }).then(response=>{
            message.success(`About ${Number(response.data.payload.split(',').join(''))} records`)
        }).catch(error=>{
            console.log(error)
        })
    }
    const localStorageCheck=async ()=>{
        if(url.trim()!==""){
            // await getNoOfRecords()
            message.success("fetching data......")
            const value=getWithExpiry(url)
            if(value===null){
                await getData()
            }else{
                setData(value)
                setDisable(false)
                setLoading(false)
            }    
        }
        else{
            message.error("URL cannot be empty")  
        }
    }
    const getAllIndexpages=async()=>{
        setDisable(true)
        setLoading(true)
        await localStorageCheck()
    }
    return(
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Index Checker: Get Index pages of the website</title>
                <meta name="description" content="Index Checker will helps you find out all the index pages of your blog or website easily with just your website name" />
            </Helmet>
            <a style={{float:"right"}} href={process.env.REACT_APP_FACEBOOK}><FacebookOutlined  style={{ fontSize: '20px', color: '#08c' }}/></a>
            <a style={{float:"right"}} href={process.env.REACT_APP_LINKEDIN}><LinkedinOutlined  style={{ fontSize: '20px', color: '#08c' }}/></a>
            <h1 style={{textAlign:"center"}}><strong>Get Index pages of the website</strong></h1>
            <label>Enter the URL :</label>
            <Input placeholder="http or https://example.com" value={url} disabled={disable} onChange={(e:any)=>{
                setUrl(e.target.value)
            }} />
            <Button style={{textAlign:"center"}} type="primary" size="small" disabled={disable}  onClick={getAllIndexpages}>Click here !!</Button>
            {loading?<Spin />:
            <Table columns={columns} dataSource={data}  pagination={{
                onChange(current:any) {
                setPage(current);
                }
            }} />
}
        </>
    )
}