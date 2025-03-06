import { useState } from 'react'
import './index.css'
import UploadResume from "./component/UploadResume";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-600" >AI-assistant for your SV</h1>
      <UploadResume />

    </div>
  );
}

export default App
