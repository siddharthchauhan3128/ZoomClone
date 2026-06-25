import Landing from './pages/Landing.jsx'
import {Routes, Route , Navigate} from 'react-router-dom'
import Authentication from './pages/Authentication.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VideoMeetComponent from './pages/VideoMeetComponent.jsx'

function App() {
  return (
    <Routes>
      <Route path = '/' element = {<Landing/>}/>
      <Route path="/auth/:mode" element={<Authentication />} />

      <Route path="/dashboard/:id" element={<Dashboard />} />
        {/* Fallback Redirects: if someone goes to /auth, /signin, or /signup, drop them into signup */}
        <Route path="/auth" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/signin" element={<Navigate to="/auth/signin" replace />} />
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} /> 
        <Route path="/:url" element={<VideoMeetComponent/>}/>
    </Routes>
  )
}

export default App
