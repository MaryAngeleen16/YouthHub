import React, { useState } from 'react'
import Navbar from '../Layouts/navBar'
import { Container, Divider, InputBase, ThemeProvider, Typography, Select, MenuItem, Button } from '@mui/material'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import AllTopics from './AllTopics';
import NewTopic from './NewTopic';
import { getToken } from '../../utils/helpers';

const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});


const Forum = () => {

    const [value, setValue] = React.useState('2');
    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = useState(false);
    const [newTopic, setNewTopic] = useState({
        title: '',
        category: '',
        content: '',
        image: '',
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setNewTopic({
            title: '',
            category: '',
            content: '',
            image: ''
        })
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onChange = e => {
        if (e.target.name === 'image') {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setNewTopic({ ...newTopic, [e.target.name]: reader.result })
                }
            }

            reader.readAsDataURL(e.target.files[0])

        } else {
            setNewTopic({ ...newTopic, [e.target.name]: e.target.value })
        }
    }


    return (
        <>
            <NewTopic
                handleClose={handleClose}
                open={open}
                handleChange={onChange}
                newTopic={newTopic}
                setNewTopic={setNewTopic}
                setSuccess={setSuccess}
            />
            <Navbar />
            <ThemeProvider theme={theme}>
                <Container maxWidth='xl' sx={{ backgroundColor: 'FFFFFF' }}>
                    <Box sx={{ width: '100%', typography: 'body1' }} mt={5} mb={20}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }} px={2}>
                                <TabList onChange={handleChange} indicatorColor='dark' textColor='secondary'>
                                    <Tab label="Categories" value="1" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                    <Tab label="All Topics" value="2" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                    <Tab label="My Topics" value="3" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                </TabList>
                                <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: '#F6B6A5', height: 35 }} my={'auto'} pl={1.5}>
                                    <SearchIcon sx={{ color: 'action.active', mr: 0, my: 0.5 }} />
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                    />
                                </Box>
                            </Box>
                            <Container maxWidth='xl' sx={{ my: 3, mt: 5 }}>
                                <Box component={'div'} sx={{ display: 'flex', px: 3 }}>
                                    <Typography variant='body1' sx={{ fontWeight: 400, mr: 1 }} color={'#666666'}>Sort by: </Typography>
                                    <Select
                                        variant='standard'
                                        label="Age"
                                        size='small'
                                        defaultValue={10}
                                        sx={{ fontSize: 16, height: 26, border: 'none', borderBottom: 'none', mr: 'auto' }}
                                    >
                                        <MenuItem value={30}>Recent Activity</MenuItem>
                                        <MenuItem value={10}>Newest to oldest</MenuItem>
                                        <MenuItem value={20}>Oldest to newest</MenuItem>
                                    </Select>
                                    <Button variant='outlined' sx={{
                                        borderColor: '#F6B6A5',
                                        textTransform: 'capitalize',
                                        color: '#F6B6A5',
                                        '&:hover': {
                                            borderColor: '#F6B6A5',
                                            color: '#F6B6A5'
                                        },
                                    }} onClick={handleClickOpen}
                                    >Create New Topic</Button>
                                </Box>
                            </Container>
                            <Divider />
                            <TabPanel value="1">Categories</TabPanel>
                            <TabPanel value="2" sx={{ pt: 1 }}>
                                <AllTopics key={success} />
                            </TabPanel>
                            <TabPanel value="3">My Topics</TabPanel>
                        </TabContext>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default Forum