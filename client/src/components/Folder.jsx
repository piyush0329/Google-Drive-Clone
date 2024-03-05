import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import FolderIcon from '@mui/icons-material/Folder';
import ListIcon from '@mui/icons-material/List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Modal } from '@mui/material'
import styled from 'styled-components'
import Chip from '@mui/material/Chip';
import axios from 'axios'
import moment from 'moment'
import { useAuth } from '../context/auth';

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray
    }
    p {
        border-top: 1px solid #ccc;
        margin-top: 5px;
        font-size: 12px;
        background: whitesmoke;
        padding: 10px 0px;
    }
`
const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`
const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
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
        margin-top:20px
    }
    button.modal__submit {
        width: 100%;
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
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`
const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`
const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`
const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`
const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`
const DataGrid = styled.div`
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:5px 10px;
        box-shadow:2px 2px 2px #ccc;
        margin-left: 20px;
        span {
            font-size: 16px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`
// const DataListRow = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     border-bottom: 1px solid #ccc;
//     padding: 10px;
//     p {
//         display: flex;
//         align-items: center;
//         font-size: 13px;
//         b {
//             display: flex;
//             align-items: center;
//         }
//         svg {
//             font-size: 22px;
//             margin:10px
//         }
//     }
// `
const Folder = () => {
    const [auth,setAuth] = useAuth()
    const [folders, setFolders] = useState([])
    const [folderName, setFolderName] = useState('')
    const [currentFolder, setCurrentFolder] = useState('')
    const [openFile, setOpenFile] = useState(false)
    const [openFolder, setOpenFolder] = useState(false)
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([])
    const navigate = useNavigate()
    const path_details = currentFolder?.path?.substring(1).split('/')
    
    const path_arr = currentFolder?.path_arr

    const { folderId } = useParams()
    const location = useLocation()

    const handleFile = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }
    const handleFolderClick = async (folderId) => {

        navigate(`/folder/${folderId}`)
    }
    const handleUploadFile = async (e) => {
        e.preventDefault();

        try {
            setUploading(true);
            const {data} = await axios.post('/files/api/upload', {file,path_name:folderId}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(data.success){
                console.log('File uploaded successfully:', data);
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem('auth')
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem('auth', JSON.stringify(ls))
                setOpenFile(false)
                loadFolder()
            }else{
                alert('unable to upload file')
                
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };
    const handleCreateFolder = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/folder/api/create-folder', { name: folderName, path_name: folderId })
            alert('folder created successfully')
            setFolderName('')
            setOpenFolder(false)
            loadFolder()
        } catch (error) {
            console.log(error)
        }
    }
    const loadFolder = async () => {
        try {
            let par_dir = folderId
            const { data } = await axios.get(`folder/api/get-folder/${par_dir}`)
            const res = await axios.get(`files/api/get-file/${par_dir}`)
            setFiles(res.data.file)
            setFolders(data.folders)
            setCurrentFolder(data.parentFolder)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        if (auth.user) {
            loadFolder()
        }
    }, [auth.user, folderId])
    return (
        <div className='row container-fluid'>
            <div className="col-12 col-md-2 p-0">
                <Sidebar />
            </div>
            <div className='col-12 col-md-10 p-0'>
                <Modal open={openFile} onClose={() => setOpenFile(false)}>
                    <ModalPopup>
                        <form onSubmit={handleUploadFile}>
                            <ModalHeading>
                                <h3>Upload a new file</h3>
                            </ModalHeading>
                            <ModalBody>
                                {uploading ? <UploadingPara>Uploading...</UploadingPara> : (
                                    <>
                                        <input type="file" className='modal__file' onChange={handleFile} />
                                        <button type="submit" className='modal__submit' >Submit</button>
                                    </>
                                )}
                            </ModalBody>
                        </form>
                    </ModalPopup>
                </Modal>
                <Modal open={openFolder} onClose={() => setOpenFolder(false)}>
                    <ModalPopup>
                        <form onSubmit={handleCreateFolder}>
                            <ModalHeading>
                                <h3>Create a new folder</h3>
                            </ModalHeading>
                            <ModalBody>
                                {uploading ? <UploadingPara>Uploading...</UploadingPara> : (
                                    <>
                                        {/* <input type="file" className='modal__file' onChange={handleFile} /> */}
                                        <input type="text" value={folderName} placeholder='Enter Folder Name' onChange={(e) => setFolderName(e.target.value)} className='tw-input w-100' />
                                        <button type="submit" className='modal__submit' >Submit</button>
                                    </>
                                )}
                            </ModalBody>
                        </form>
                    </ModalPopup>
                </Modal>
                <DataContainer>
                    <DataHeader>
                        <div className="headerLeft">
                            {

                                path_details &&
                                path_details.map((path,i) => (
                                    (path === auth.user._id) ? (
                                        <Chip key={path} label={"My Drive"} variant="outlined" onClick={() => { navigate('/') }} />
                                    ) : (
                                       i===path_details.length-1? <Chip key={path} disabled label={path} variant="outlined" />
                                       : <Chip  key={path} label={path} variant="outlined" onClick={()=>{navigate(`/folder/${path_arr[i]}`)}} />
                                    )
                                ))
                            }

                        </div>
                        <div className="headerRight">
                            <ListIcon />
                            <InfoOutlinedIcon />
                        </div>
                    </DataHeader>
                    <div className='d-flex mt-2'>
                        <SidebarBtn>
                            <button onClick={() => setOpenFile(true)}>
                                <img src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                                <span>New file</span>
                            </button>
                        </SidebarBtn>
                        <SidebarBtn>
                            <button onClick={() => setOpenFolder(true)}>
                                <img src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                                <span>New folder</span>
                            </button>
                        </SidebarBtn>
                    </div>
                    <div>
                        <DataGrid className='row'>
                            {folders.length !== 0 ? <h5>Folders</h5> : ''}
                            {folders.map(folder => (
                                <DataFile className='col-4 col-md-2' key={folder._id} onClick={() => { handleFolderClick(folder._id) }} >
                                    <FolderIcon />
                                    <p>{folder.name}</p>
                                </DataFile>

                            ))}
                        </DataGrid>
                    </div>
                    <div>
                        {files.length !== 0 ? <h5>Files</h5> : ''}
                        <div className='row'>
                            {files &&
                                files.map(file => (
                                    file.type === 'image/png' ?
                                        <Card key={file._id} sx={{ maxWidth: 250 }} className='col-4 col-md-2 m-2'>
                                            <CardActionArea>
                                                <CardMedia
                                                    component={'img'}
                                                    height="100"
                                                    image={`http://localhost:8080${file.path}`}
                                                    alt="file"
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="body1" component="div">
                                                        <Link className='tw-no-underline' to ={`http://localhost:8080${file.path}`} >{file.name}</Link>
                                                    </Typography>

                                                    <Typography variant="body2" color="text.secondary">
                                                        size: {file.size} mb
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                    {moment(file?.createdAt).fromNow()}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                        :
                                        <Card key={file._id} sx={{ maxWidth: 250 }} className='col-4 col-md-2 m-2'>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="body1" component="div">
                                                    <Link className='tw-no-underline' to ={`http://localhost:8080${file.path}`} >{file.name}</Link>
                                                    </Typography>

                                                    <Typography variant="body2" color="text.secondary">
                                                        size: {file.size} mb
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {moment(file?.createdAt).fromNow()}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                ))
                            }
                        </div>
                    </div>
                </DataContainer>
            </div>
        </div>
    )
}

export default Folder
