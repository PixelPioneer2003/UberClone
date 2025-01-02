import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import userProtectWrapper from './pages/userProtectWrapper'
import captainProtectWrapper from './pages/captainProtectWrapper'
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
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/user/logout" element={
            <userProtectWrapper><UserLogout /></userProtectWrapper> }/>
        <Route path="/home" element={<userProtectWrapper> <Home />  </userProtectWrapper> }/>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
         <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path='/captain-home' element={
          <captainProtectWrapper><CaptainHome /></captainProtectWrapper>}/>
      </Routes>
    </div>
  )
}

export default App
