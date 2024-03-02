import React from 'react'
import Sidebar from '../components/Sidebar'
import { useSearch } from '../context/search'

import FolderIcon from '@mui/icons-material/Folder';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import styled from 'styled-components'

import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom';



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

const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`
const DataGrid = styled.div`
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`


const Search = () => {

    const [values, setValues] = useSearch()
    const navigate = useNavigate()
    const handleFolderClick = (folderId) => {
        navigate(`/folder/${folderId}`)
    }

    return (
        <div className='row container-fluid'>
            <div className="col-12 col-md-3">
                <Sidebar />
            </div>
            <div className='col-12 col-md-9'>

                <h1>Search Results</h1>
                {values.results.length === 0 && <h6>
                    No file and folder exist..
                </h6>}
                {values.results.length !== 0 &&
                    <DataContainer>
                        <DataHeader>
                            {/* <div className="headerLeft">

                        </div> */}
                        </DataHeader>
                        <div>
                            <DataGrid className='row'>
                                {(values?.results?.folders?.length !== 0) ? <h5>Folders</h5> : ''}
                                {
                                    values?.results?.folders &&
                                    values?.results?.folders.map(folder => (
                                        <DataFile className='col-6 col-md-3' key={folder._id} onClick={() => { handleFolderClick(folder._id) }} >
                                            <FolderIcon />
                                            <p>{folder.name}</p>
                                        </DataFile>

                                    ))}
                            </DataGrid>
                        </div>
                        <div>
                            {values?.results?.files?.length !== 0 ? <h5>Files</h5> : ''}
                            <div className='row'>
                                {values?.results?.files &&
                                    values?.results?.files.map(file => (
                                        file.type === 'image/png' ?
                                            <Card key={file._id} sx={{ maxWidth: 250 }} className='col-6 col-md-3 m-2'>
                                                <CardActionArea>
                                                    <CardMedia
                                                        component={'img'}
                                                        height="100"
                                                        image={`http://localhost:8080${file.path}`}
                                                        alt="file"
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="body1" component="div">
                                                            <Link className='tw-no-underline' to={`http://localhost:8080${file.path}`} >{file.name}</Link>
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
                                            <Card key={file._id} sx={{ maxWidth: 250 }} className='col-6 col-md-3 m-2'>
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography gutterBottom variant="body1" component="div">
                                                            <Link className='tw-no-underline' to={`http://localhost:8080${file.path}`} >{file.name}</Link>
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
                    </DataContainer>}
            </div>
        </div>
    )
}

export default Search
