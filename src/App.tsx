import { Route, Routes } from 'react-router-dom'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  )
}

export default App
