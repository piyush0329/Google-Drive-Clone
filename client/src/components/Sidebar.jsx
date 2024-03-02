import React from 'react'
import styled from 'styled-components';

import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

import {useNavigate} from 'react-router-dom'
import { useAuth } from '../context/auth';

const SidebarContainer = styled.div`
    margin-top: 10px;
`

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    &:hover{
        background: whitesmoke;
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
    }
    span {
        margin-left: 15px;
        font-size: 13px;
        font-weight: 500;
        color:rgb(78, 78, 78)
    }
`


const Sidebar = () => {


    // storage.ref(`files/${file.name}`).put(file).then(snapshot => {
    //     storage.ref("files").child(file.name).getDownloadURL().then(url => {
    //         db.collection("myfiles").add({
    //             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //             filename: file.name,
    //             fileURL: url,
    //             size: snapshot._delegate.bytesTransferred
    //         })
    //         setUploading(false)
    //         setFile(null)
    //         setOpen(false)
    //     })
    // })
    const navigate = useNavigate()
    const [auth] = useAuth()

    return (
        <>

            <SidebarContainer>

                <SidebarOptions>
                    <SidebarOption onClick={()=>{navigate('/')}}>
                        <MobileScreenShareIcon />
                        <span>My Drive</span>
                    </SidebarOption>
                    <SidebarOption>
                        <DevicesIcon />
                        <span>Computers</span>
                    </SidebarOption>
                    <SidebarOption>
                        <PeopleAltOutlinedIcon />
                        <span>Shared with me</span>
                    </SidebarOption>
                    <SidebarOption>
                        <QueryBuilderOutlinedIcon />
                        <span>Recent</span>
                    </SidebarOption>
                    <SidebarOption>
                        <StarBorderOutlinedIcon />
                        <span>Starred</span>
                    </SidebarOption>
                    <SidebarOption>
                        <DeleteOutlineOutlinedIcon />
                        <span>Trash</span>
                    </SidebarOption>
                </SidebarOptions>
                <hr />
                <SidebarOptions>
                    <SidebarOption>
                        <CloudQueueIcon />
                        <span>Storage</span>
                    </SidebarOption>
                    <div className="progress_bar">
                        <progress size="tiny" value={1048576-auth?.user?.storage} max={1048576} />
                        <span>{((1048576-auth?.user?.storage)/(1024*1024)).toFixed(2)} GB  of {1048576/(1024*1024)} GB used</span>
                    </div>
                </SidebarOptions>
            </SidebarContainer>
        </>
    )
}

export default Sidebar
