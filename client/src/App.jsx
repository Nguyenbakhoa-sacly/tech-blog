
import './App.scss'
import Home from './pages/Home'
import About from './pages/About'
import Project from './pages/Project'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Main from './layout/Main'
import { Route, Routes, } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
const App = () => {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='project' element={<Project />} />
        <Route path='sign-in' element={<SignIn />} />
        <Route path='sign-up' element={<SignUp />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
