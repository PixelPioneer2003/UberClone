import React from 'react'
import { useNavigate,useEffect } from 'react-router-dom'

const userProtectWrapper = ({children}) => {
    const navigate=useNavigate()
    const token=localStorage.getItem('token')
    useEffect(() => {
        if(!token){
            navigate('/login')
        }
    }, [token])
  return (
    <>
    </>
  )
}

export default userProtectWrapper