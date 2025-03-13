import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <>
    <div><Link to={'/'}><Button onClick={()=>{sessionStorage.clear()}}>LOGOUT</Button></Link></div>
    <div className='mt-5 text-center'>AdminDashboard</div>
    </>
    
  )
}

export default AdminDashboard