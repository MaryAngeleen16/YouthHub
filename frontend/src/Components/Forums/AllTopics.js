import React, { useEffect, useState } from 'react'
import { Box, Divider, Typography } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios'
import { getToken } from '../../utils/helpers';

const AllTopics = () => {

    const config = {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const [forumTopics, setForumTopics] = useState([]);

    const getAllTopics = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/all-topics`, config);

            setForumTopics(data.forumTopics);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllTopics();
    }, []);

    return (
        <>
            <Box component={'div'}>

            </Box>
            <Divider></Divider>
            <Box>
                {forumTopics.map(topic => {
                    return <List key={topic._id} sx={{ width: '100%', bgcolor: 'background.paper', px: 1 }}>
                        <ListItem sx={{ width: '100%' }}>
                            <ListItemText primary={
                                <Typography variant='h5' sx={{ mb: 0.5 }}>{topic.title}</Typography>
                            } secondary={
                                <Typography sx={{ px: 0.3, color: '#666666', fontWeight: 400 }}>
                                    {topic.user.name} · {topic.category.name}
                                </Typography>
                            } />
                            <Box display={'flex'} alignItems={'center'} flex={'row'} mr={10}>
                                <ChatBubbleOutlineIcon sx={{ mr: 1.5, color: '#666666' }} fontSize='medium' />
                                <ListItemText sx={{ fontSize: 100 }}>
                                    <Typography fontSize={'20px'} sx={{ mt: -0.6 }}>{topic.userComments.length > 0 ? topic.userComments.length : 0}</Typography>
                                </ListItemText>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} flex={'row'}>
                                <Typography fontSize={'18px'} sx={{ mt: -0.6, mr: 1, color: '#666666' }}>Recent Activity: </Typography>
                                <ListItemText sx={{ fontSize: 100 }}>
                                    <Typography fontSize={'18px'} sx={{ mt: -0.6 }}>{new Date(topic.updatedAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                </ListItemText>
                            </Box>
                        </ListItem>
                        <Divider sx={{ width: '100%' }} />
                    </List>
                })}
            </Box>
        </>
    )
}

export default AllTopics