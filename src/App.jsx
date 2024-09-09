import { useEffect, useState } from 'react'
import { Footer, Header } from './components/index.js'
import {Outlet} from "react-router-dom"
import { useDispatch } from 'react-redux'
import authService from './services/authServices.js'
import { login, logout } from './store/authSlice.js'

function App() {
  const [loader, setLoader] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      console.log(userData)
      if(userData){
        dispatch(login(userData.data))
      }else{
        dispatch(logout())
      }
    })
    .finally(() => {
      setLoader(false)
    })
  }, [])

  if (!loader){
    return (
      <div className='overflow-hidden mx-auto h-screen max-w-screen-2xl bg-gray-700 relative '>
        <Header />
          <main>
             <Outlet /> 
          </main>
        <Footer />
      </div>
    
    )
  }else{
    return <div>Loading....</div>
  }
    
}

export default App