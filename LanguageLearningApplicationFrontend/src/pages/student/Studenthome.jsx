import React from 'react'

const Studenthome = () => {
  return (
    <>
    <div><Link to={'/'}><Button onClick={()=>{sessionStorage.clear()}}>LOGOUT</Button></Link></div>
    <div className='text-center mt-5'>StudentHome</div>
    </>
  )
}

export default Studenthome