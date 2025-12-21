import './App.css'
import Header from './pages/common/header/header';
import Footer from './pages/common/footer/footer';
import Login from './pages/login/login.tsx';
import RegistUser from './pages/registUser/registUser.tsx';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/home.tsx';


function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home />} /> 
          <Route path="/registUser" element={<RegistUser />} /> 
          {/* 存在しないURLに来たとき */}
          <Route path="*" element={<div>ページが見つかりません</div>} />
        </Routes>
      <Footer />
    </>
  );
}

export default App
