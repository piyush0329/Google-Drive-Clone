import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search';

import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from '@mui/material'
import { useSearch } from '../context/search';
import axios from 'axios'



const HeaderContainer = styled.div`
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 5px 10px;
    height: 65px;
    border-bottom: 1px solid lightgray;
`
const HeaderLogo = styled.div`
    display: flex;
    align-items: center;
    img {
        width: 40px;
    }
    span{
        font-size: 22px;
        margin-left: 10px;
        color: gray;
    }
`

const HeaderSearch = styled.div`
    display: flex;
    align-items: center;
    width: 700px;
    background-color: whitesmoke;
    padding: 12px;
    border-radius: 10px;
    input{
        background-color: transparent;
        border: 0;
        outline: 0;
        flex: 1;
    }
`
const HeaderIcons = styled.div`
    display: flex;
    align-items: center;
    span {
        display: flex;
        align-items: center;
        margin-left: 5px;
    }
    svg.MuiSvgIcon-root{
        margin: 0px 10px;
    }
`


const Header = () => {

    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()
    // const [keyword,setKeyword] = useState('')
    const [values,setValues] = useSearch()
    // const [cart] = useCart()
    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        navigate('/')
        alert("Logout Successfully")
    }

    const handleSearch=async ()=>{
        
        try {
            if(values.keyword){
                const { data } = await axios.get( `http://localhost:8080/folder/api/search/${values.keyword}` );
              setValues({ ...values, results: data });
              navigate("user/search");
            }else{
                alert('please enter something to search')
            }
        } catch (error) {
            console.log(error)  
        }
    }
   
    return (
        <HeaderContainer className=''>
            <HeaderLogo>
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Google Drive" />
                <span>Drive</span>
            </HeaderLogo>

            {
                auth.user ? (
                    <>
                        <HeaderSearch> 

                            <input type="text" placeholder='Search in Drive' onChange={(e)=>setValues({ ...values, keyword: e.target.value })} />
                            <button onClick={handleSearch} type='submit' className="tw-text-white tw-rounded-xl tw-bg-violet-500 hover:tw-bg-violet-600 active:tw-bg-violet-700 focus:tw-outline-none focus:tw-ring focus:tw-ring-violet-300">
                            <SearchIcon />
                            </button>
                            
                        </HeaderSearch>
                        <HeaderIcons>
                            <span>
                                <NavLink to="/" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'tw-text-blue-300' : 'text-black'}`}>Home
                                </NavLink>
                            </span>
                            <span >
                                {/* <span className='text-bold'> {auth.user.name}</span> */}
                                <NavLink to="user/profile" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'tw-text-blue-300' : 'text-black'}`}><Avatar src={`http://localhost:8080${auth.user.profile_pic}`} />
                                </NavLink>


                            </span>
                            <span onClick={handleLogout} ><LogoutIcon /></span>

                        </HeaderIcons>
                    </>
                )
                    : (
                        <>
                            <div className='ms-auto d-flex'>

                                <span>
                                    <NavLink to="/" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'tw-text-blue-300' : 'text-black'}`}>Home
                                    </NavLink>
                                </span>

                                <span>
                                    <NavLink to="/register" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'tw-text-blue-300' : 'text-black'}`}>Register
                                    </NavLink>
                                </span>


                                <span>
                                    <NavLink to="/login" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'tw-text-blue-300' : 'text-black'}`}>
                                        Login
                                    </NavLink>
                                </span>

                            </div>

                        </>

                    )
            }
        </HeaderContainer>















        // <div >
        //     <nav className="navbar navbar-expand-lg bg-secondary" >
        //         <div className="container-fluid">
        //         <HeaderLogo>
        //         <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Google Drive" />
        //         <span className='text-white'>Drive</span>
        //     </HeaderLogo>
        //             <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        //                 <span className="navbar-toggler-icon" />
        //             </button>
        //             <div className="collapse navbar-collapse" id="navbarSupportedContent">
        //                 <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        //                     {
        //                         !auth.user ?
        //                             (<>
        //                                 <li>
        //                                     <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`}>Home
        //                                     </NavLink>
        //                                 </li>
        //                                 <li>
        //                                     <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`}>Register
        //                                     </NavLink>
        //                                 </li>
        //                                 <li>
        //                                     <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`}>
        //                                         Login
        //                                     </NavLink>
        //                                 </li>

        //                             </>
        //                             ) : (
        //                                 <>

        //                                     <li className="nav-item" >
        //                                         <div className='nav-link'>{auth?.user?.name}</div>
        //                                     </li>
        //                                     <li className="nav-item">
        //                                         <NavLink to={'/'} className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`} aria-current="page" >Home</NavLink>
        //                                     </li>
        //                                     <li className="nav-item">
        //                                         <NavLink to={'/dashboard/data'} className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`} aria-current="page" >Dashboard</NavLink>
        //                                     </li>
        //                                     <li className='nav-item'>
        //                                         <NavLink to="/login" onClick={handleLogout} className={({ isActive }) => `nav-link ${isActive ? 'tw-text-blue-300' : 'text-white'}`}>
        //                                             Logout
        //                                         </NavLink>
        //                                     </li>
        //                                 </>
        //                             )
        //                     }
        //                 </ul>
        //             </div>
        //         </div>
        //     </nav>
        // </div>
    )
}

export default Header
