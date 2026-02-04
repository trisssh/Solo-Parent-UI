import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Login3 from './pages/Login3'
import Login4 from './pages/Login4'
import UserRegister from './pages/UserRegister'

function App() {


  return (
    <>
      <div className="web_container flex">
        <main className="flex-1 transition-all duration-500">
          <Login4 />
        </main>
      </div>
    </>
  );
}

export default App
