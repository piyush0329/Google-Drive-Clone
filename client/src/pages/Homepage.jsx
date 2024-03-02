import React from 'react'
import Sidebar from '../components/Sidebar'
import Data from '../components/Data'
import styled from 'styled-components'
import { useAuth } from '../context/auth'
import { Link } from 'react-router-dom'


const LoginWrapper = styled.div`
  background: lightgrey;
  padding: 20px;
  width: 400px;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  img {
    width: 100px;
  }
  .button {
    width: 100%;
    text-decoration:none;
    background: darkmagenta;
    padding: 10px 20px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 5px;
    font-size: 16px;
    border: 0;
    outline: 0;
    border-radius: 5px;
    cursor: pointer;
    margin-top:20px;
    
  }
`

const Homepage = () => {
  const [auth] = useAuth()
  return (
    <>
      {auth?.user ? (
        <div className='row container-fluid'>
          <div className="col-12 col-md-2 p-0">
            <Sidebar />

          </div>
          <div className='col-12 col-md-10 p-0'>
            <Data />
          </div>
        </div>
      ) : (
        <LoginWrapper>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" alt="gdrive" />
          <Link className='button' to={'/login'}>Login to Google Drive</Link>
          <Link className='button' to={'/register'}>New User? register here</Link>

        </LoginWrapper>
      )
      }
    </>
  )
}

export default Homepage
