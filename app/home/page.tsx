'use client'
import React, { useEffect } from 'react'
import Formcomponent from '../components/Formcomponent'
import { callApi } from '../lib/useCallApi'
import { logout } from '../authSync'

const page = () => {
  const getStarted = async() => {
    const res:any = await callApi({
      url: "user/search-filters",
      method: "get",
    })
    console.log(res);
  }
  useEffect(() => {
    getStarted();
  },[])
  return (
    <div className='min-h-full'>
       Home Page
       <button onClick={() => logout()}>LOGOUT</button>
    </div>
  )
}

export default page