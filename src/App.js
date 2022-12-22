import './App.css'
import Header from './components/shared/header'
import Footer from './components/shared/footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import WritePost from './pages/WritePost'
import ViewPost from './pages/ViewPost'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="login/:id" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile/:id" element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="write" element={<Home goTo="write" />} />
            <Route path="view/:id" element={<ViewPost />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
