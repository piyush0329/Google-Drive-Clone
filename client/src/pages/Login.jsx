import axios from 'axios'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const [auth, setAuth] = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };



    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/auth/api/login', { email, password })

            if (res && res.data.success) {
                alert(res.data && res.data.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || "/");
            } else {
                alert(res.data.message)
            }

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    return (
        <div className='d-flex flex-column tw-bg-lightGrey'>
            <h1 className='text-center'>Login</h1>

            <div className='border p-4'>
                <form onSubmit={handleLogin} >

                    <Box sx={{ maxWidth: '100%' }} >
                        <div className='my-2'>
                            <TextField required onChange={(e) => setEmail(e.target.value)} fullWidth label="Email" value={email} />
                        </div>

                        <div className='my-2'>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                        </div>
                    </Box>
                    <button type="submit" className="tw-btn tw-btn-outline tw-bg-red text-white tw-rounded-xl">Submit</button>
                    <div className="mb-3">
                        <Link to={'/register'} className="form-label underline text-black">Dont't have an account yet?<span className='font-weight-bold text-primary'>Register</span></Link>

                    </div>
                </form>
            </div>

        </div >
    )
}

export default Login
