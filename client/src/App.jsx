import React from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signin from './components/Signin';
import BookTable from './pages/BookTable';
import Blog from './pages/Blog';
import Owner from './pages/Owner';
import Registration from './componentsOwner/Registration';
import Login from './componentsOwner/Login';
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      <Route exact path="/login" element={<Signin/>}></Route>
      <Route exact path="/logout" element={<Home/>}></Route>
      <Route exact path="/book-a-table" element={<BookTable/>}></Route>
      <Route exact path="/blog" element={<Blog/>}></Route>
      <Route exact path="/owner-home" element={<Owner/>}></Route>
      <Route exact path="/owner-registration" element={<Registration/>}></Route>
      <Route exact path="/owner-login" element={<Login/>}></Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
