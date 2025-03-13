import React from 'react'

const InstructorHome = () => {
  return (
    <>
    <div><Link to={'/'}><Button onClick={()=>{sessionStorage.clear()}}>LOGOUT</Button></Link></div>
    <div className='mt-5 text-center'>InstructorHome</div>
    </>
    
  )
}

export default InstructorHome