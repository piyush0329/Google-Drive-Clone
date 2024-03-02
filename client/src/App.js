import './App.css';
import { Routes, Route } from 'react-router'
import Layout from './Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import axios from 'axios';
import Private from './Routes/Private';
import Folder from './components/Folder';
import Search from './pages/Search';
import Userprofile from './pages/user/Userprofile';

axios.defaults.baseURL = 'http://localhost:8080'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />} >
        <Route index element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/folder' element={<Private />} >
          <Route path=':folderId' element={<Folder />} />
        </Route>
        <Route path='/user' element={<Private/>}>
          <Route path='profile' element={<Userprofile/>} />
          <Route path='search' element={<Search />} />
        </Route>
        


      </Route>
    </Routes>


  );
}

export default App;
