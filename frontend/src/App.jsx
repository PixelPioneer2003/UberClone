import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import UserProtectWrapper from './pages/UserProtectWrapper'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import UserLogin from './pages/UserLogin'
import CaptainSignup from './pages/CaptainSignup'
import Captainlogin from './pages/Captainlogin'
import UserLogout from './pages/UserLogout'
import Home from './pages/Home'
import Start from './pages/Start'
import CaptainHome from './pages/CaptainHome'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'
import CaptainLogout from './pages/CaptainLogout'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/user/logout" element={
            <UserProtectWrapper><UserLogout /></UserProtectWrapper> }/>
            <Route path="/captain/logout" element={
              <CaptainProtectWrapper><CaptainLogout /></CaptainProtectWrapper> }/>
        <Route path="/home" element={<UserProtectWrapper> <Home />  </UserProtectWrapper> }/>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
         <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path='/captain-home' element={
          <CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>}/>
      </Routes>
    </div>
  )
}

export default App
