import React from 'react'
import { useNavigate} from 'react-router-dom'
import { useEffect } from 'react'

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
    {children}
    </>
  )
}

export default userProtectWrapper