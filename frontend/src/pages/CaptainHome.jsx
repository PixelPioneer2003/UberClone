import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import {SocketContext} from '../context/SocketContext';
import {useContext, useEffect} from 'react';
import {CaptainDataContext} from '../context/CaptainContext';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const {socket} = useContext(SocketContext);
    const [ ride, setRide ] = useState(null)
    const {captain} = useContext(CaptainDataContext);

    
    
 useEffect(() => {
    if (captain?._id) {
        console.log(`${captain._id} user captain`);

        try {
            // Emit the join event
            socket.emit("join", {
                userType: "captain",
                userId: captain._id,
            });

            // Handle potential errors from the server
            socket.on("error", (err) => {
                console.error("Socket error:", err);
            });
        } catch (error) {
            console.error("Error in socket.emit:", error);
        }
    }
    //  finding the location of the captain
    // we need concept of ports  as to find the location of the captainn using browser
    const updateLocation=()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                const location={
                    ltd:position.coords.latitude,
                    lng:position.coords.longitude
                }
                // console.log("location",location);
                socket.emit("update-location-captain",{
                    userId:captain._id,
                    location
                })
            })
        }
    }
    // call update in every 10 seconds
    const locationInterval=setInterval(updateLocation,10000);
    updateLocation();
}, [captain]);
async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)

    }

   // recieve the data from the server of the ride
   socket.on("new-ride", (ride) => {
    console.log("Ride request:", ride);
      setRide(ride)
    setRidePopupPanel(true)
   });
    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])
    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])
    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp   confirmRide={confirmRide} ride={ride} setRidePopupPanel={setRidePopupPanel}  setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel}  />
            </div>
        </div>
    )
}
export default CaptainHome