import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



const Register = () => {
    const [name, setName] = useState('')

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('')
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleFile = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/auth/api/register', { file, name, email, password, phone, gender }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (res && res.data.success) {
                alert(res.data && res.data.message);
                setPassword('')
                navigate('/login')

            } else {
                setPassword('')
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }

    return (
        <div className='d-flex flex-column tw-bg-lightGrey'>
            <h1 className='text-center'>Register</h1>
            <div className='border p-4'>
                <form onSubmit={handleRegister}>
                    <Box sx={{ maxWidth: '100%' }} >

                        <div className='my-2'>
                            <TextField required onChange={(e) => setName(e.target.value)} fullWidth label="Name" value={name} />
                        </div>
                        <div className='my-2'>
                            <TextField required onChange={(e) => setEmail(e.target.value)} fullWidth label="Email" value={email} />
                        </div>
                        <div className='my-2'>
                            <TextField required onChange={(e) => setPhone(e.target.value)} fullWidth label="Phone Number" value={phone} />
                        </div>
                        <div className='my-2'>
                            <TextField required onChange={(e) => setGender(e.target.value)} fullWidth label="Gender" value={gender} />
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
                        <div>
                            Choose Profile Pic
                        </div>
                        <div className='tw-flex tw-items-center tw-space-x-6 my-3'>
                            <label className="tw-block">
                                <span className="tw-sr-only">Choose profile photo</span>
                                <input required type="file" onChange={handleFile} className="tw-block tw-w-full tw-text-sm tw-text-slate-500 file:tw-mr-4 file:tw-py-2 file:tw-px-4 file:tw-rounded-full file:tw-border-0 file:tw-text-sm file:tw-font-semibold file:tw-bg-violet-50 file:tw-text-violet-700 hover:file:tw-bg-violet-100" />
                            </label>
                        </div>
                    </Box>
                    <button type="submit" className="tw-btn tw-btn-outline tw-bg-red text-white tw-rounded-xl">Submit</button>
                    <div className="mb-3">
                        <Link to={'/login'} className="form-label underline text-black">Already a user?<span className='font-weight-bold text-primary'>Login</span></Link>

                    </div>
                </form>
            </div>

        </div >
    )
}

export default Register
