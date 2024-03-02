import React, { useState } from 'react'
import UserSidebar from './Usersidebar';
import { useAuth } from '../../context/auth';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'

const Userprofile = () => {
    const [auth, setAuth] = useAuth()
    const [name, setName] = useState(auth?.user?.name)
    // const [email,setEmail] = useState(auth?.user?.email)
    const [phone, setPhone] = useState(auth?.user?.phone)
    const [gender, setGender] = useState(auth?.user?.gender)
    const [password, setPassword] = useState('')
    const [profilePic, setProfilePic] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleFile = e => {

        if (e.target.files[0]) {
            setProfilePic(e.target.files[0])
        }
    }
    console.log(profilePic)
    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        try {
            if (password) {
                const { data } = await axios.put('/auth/api/user-update', { profilePic, name, password, phone, gender },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                )
                if (data?.error) {
                    alert("error")
                }
                else {
                    setAuth({ ...auth, user: data?.updatedUser })
                    let ls = localStorage.getItem('auth')
                    ls = JSON.parse(ls)
                    ls.user = data.updatedUser
                    localStorage.setItem('auth', JSON.stringify(ls))

                    setPassword('')
                    setProfilePic(null)
                    alert("User Updated Successfully")
                }
            }
            else {
                alert('please provide password')
            }
        } catch (error) {
            console.log(error)
            alert("Something Went Wrong")
        }
    }

    return (
        <>
            <div className="row container-fluid">
                <div className="col-12 col-md-2 p-0">
                    <UserSidebar />
                </div>
                <div className="col-12 col-md-10 ps-2">
                    <h4 className='p-2'>Update details</h4>
                    <br />
                    <form onSubmit={handleProfileUpdate} >
                        <Box sx={{ width:'80%', maxWidth: '100%', }}>

                            <div className='my-2'>
                                <TextField onChange={(e) => setName(e.target.value)} fullWidth label="Name" value={name} />
                            </div>
                            <div className='my-2'>
                                <TextField onChange={(e) => setGender(e.target.value)} fullWidth label="gender" value={gender} />
                            </div>
                            <div className='my-2'>
                                <TextField onChange={(e) => setPhone(e.target.value)} fullWidth label="Phone" value={phone} />
                            </div>
                            <div className='my-2'>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
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

                            <div className='tw-flex tw-items-center tw-space-x-6 my-2'>
                                <div className="tw-shrink-0">
                                    <img className="tw-h-16 tw-w-16 tw-object-cover tw-rounded-full" src={`http://localhost:8080/${auth?.user?.profile_pic}`} alt="Current profile" />
                                </div>
                                <label className="tw-block">
                                    <span className="tw-sr-only">Choose profile photo</span>
                                    <input type="file" onChange={handleFile} className="tw-block tw-w-full tw-text-sm tw-text-slate-500 file:tw-mr-4 file:tw-py-2 file:tw-px-4 file:tw-rounded-full file:tw-border-0 file:tw-text-sm file:tw-font-semibold file:tw-bg-violet-50 file:tw-text-violet-700 hover:file:tw-bg-violet-100" />
                                </label>
                            </div>
                            <div className='my-2'>
                                <button onClick={handleProfileUpdate} className="tw-shadow-[inset_0_0_0_2px_#616467] tw-px-8 tw-py-4 tw-rounded-xl tw-tracking-widest tw-uppercase tw-font-bold tw-bg-transparent hover:tw-bg-[#616467] hover:tw-text-white dark:tw-text-neutral-200 tw-transition tw-duration-200">
                                    Update Profile
                                </button>
                            </div>

                        </Box>
                    </form>
                </div>


            </div>

        </>
    )
}

export default Userprofile
