import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx';
function App() {
  
  const[msg,setmsg]=useState("")
  const[status,setstatus]=useState(false)
  const[emailList,setemailList]=useState([])

  function handlemsg(event){
    setmsg(event.target.value)
  }

  function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendmail",{msg:msg,emailList:emailList})
    .then(function(data){
      if(data.data===true){
        alert("Email Sent Successfully")
        setstatus(false)
      }
      else{
        alert("Email Not sent")
      }
    })
  }

  function handleFile(event){
    const file = event.target.files[0];
    console.log(file)

    const reader = new FileReader();
    reader.onload = function(e){
      const data = e.target.result;
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, {header: 'A'});
      console.log(emailList);
      const totalList = emailList.map(function(item){
        return item.A;
      })
      setemailList(totalList);
      console.log(totalList);

      // Further processing of emailList can be done here
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <div className='bg-blue-950 text-white text-center font-bold px-4 py-2 text-2xl'>
        <h1>BulkMail</h1>
      </div>

      <div className='bg-blue-800 text-white font-medium text-center px-4 py-2'>
        <h1>We can help your business with sending multiple emails at once</h1>

      </div>

      <div className='bg-blue-600 text-white text-center'>
        <h1 className='font-medium px-4 py-2'>Drag and Drop</h1>

      </div>

      <div className='bg-blue-400 flex flex-col items-center px-4 py-6'>
        <textarea onChange={handlemsg} value={msg} className='w-[60%] h-32 outline-none border-black p-2' placeholder='Enter your emails here....'></textarea>
        <div>
          <input type="file" onChange={handleFile} id="fileInput" className='mt-4 mb-4 border border-dashed px-4 py-4'/>
        </div>
        <p>Total emails in the file: {emailList.length}</p>
        <button onClick={send} className='bg-blue-950 text-white font-medium py-1 px-2 rounded-md mt-2 mb-2'>{status?"Sending":"Send"}</button>
        
      </div>

      <div className='bg-blue-300 text-center text-white h-26 w-full'>

      </div>

      <div className='bg-blue-200 text-center text-white h-20'></div>

      <div className='bg-blue-100 h-16'></div>
     

    </>
  )
}

export default App
