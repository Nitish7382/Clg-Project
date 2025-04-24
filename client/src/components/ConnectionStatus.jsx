// "use client"

// import { useState, useEffect } from "react"
// import { checkServerConnection } from "../Api"

// const ConnectionStatus = () => {
//   const [isConnected, setIsConnected] = useState(true)
//   const [checking, setChecking] = useState(true)

//   useEffect(() => {
//     let isMounted = true

//     const checkConnection = async () => {
//       if (!isMounted) return
//       setChecking(true)
//       const connected = await checkServerConnection()
//       if (isMounted) {
//         setIsConnected(connected)
//         setChecking(false)
//       }
//     }

//     checkConnection()

//     // Check connection every 60 seconds instead of 30
//     const interval = setInterval(checkConnection, 60000)

//     return () => {
//       isMounted = false
//       clearInterval(interval)
//     }
//   }, [])

//   if (checking) return null

//   if (!isConnected) {
//     return (
//       <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
//         <p className="flex items-center">
//           <span className="inline-block w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></span>
//           Server connection lost. Please check your backend server.
//         </p>
//       </div>
//     )
//   }

//   return null
// }

// export default ConnectionStatus
