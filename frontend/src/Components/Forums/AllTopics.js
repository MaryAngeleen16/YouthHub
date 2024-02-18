import React, { memo, useEffect, useState } from 'react'
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
import BackDropLoading from '../Layouts/BackDropLoading';

const AllTopics = memo(({ setTopic, setValue, sortType, setCategory }) => {

    const [loading, setLoading] = useState();

    const config = {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const [forumTopics, setForumTopics] = useState([]);

    const getAllTopics = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/all-topics?sortType=${sortType}`, config);
            setLoading(false)
            setForumTopics(data.forumTopics);

        } catch (err) {
            setLoading(false)
            alert("Error occured")
            console.log(err);
        }
    }

    useEffect(() => {
        getAllTopics();
    }, [sortType]);

    const handleTopic = (id) => {
        setTopic(id)
        setValue('5')
    }

    const gotoCategory = (id) => {
        setCategory(id)
        setValue('4')
    }

    return (
        <>
            <BackDropLoading open={loading} />
            <Box component={'div'}>

            </Box>
            <Box>
                {forumTopics.map(topic => {
                    return <List key={topic._id} sx={{
                        width: '100%',
                        // bgcolor: 'background.paper',
                        px: 1
                    }}>
                        <ListItem sx={{ width: '100%' }}>
                            <ListItemText primary={
                                <Typography
                                    onClick={() => handleTopic(topic._id)}
                                    variant='h5'
                                    sx={{
                                        mb: 0.5, cursor: 'pointer',
                                        "&:hover": {
                                            color: '#666666'
                                        },
                                    }}>{topic.title}
                                </Typography>
                            } secondary={
                                <Typography sx={{ px: 0.3, fontWeight: 300 }}>
                                    {topic.user.name} · <Typography variant='span' onClick={() => gotoCategory(topic.category._id)} sx={{
                                        cursor: 'pointer',
                                        "&:hover": {
                                            color: '#666666'
                                        },
                                    }}>{topic.category.name}</Typography>
                                </Typography>
                            } />
                            <Box display={'flex'} alignItems={'center'} flex={'row'} mr={10}>
                                <ChatBubbleOutlineIcon sx={{ mr: 1.5, color: '#666666' }} fontSize='medium' />
                                <ListItemText sx={{ fontSize: 100 }}>
                                    <Typography fontSize={'20px'} sx={{ mt: -0.6 }}>{getTotalComments(topic?.userComments)}</Typography>
                                </ListItemText>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} flex={'row'} mr={3}>
                                <Typography fontSize={'16px'} sx={{ mt: -0.6, mr: 1, color: '#666666' }}>Recent Activity: </Typography>
                                <ListItemText sx={{ fontSize: 100 }}>
                                    <Typography fontSize={'16px'} sx={{ mt: -0.6 }}>{new Date(topic.updatedAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                </ListItemText>
                            </Box>
                            <Box display={'flex'} alignItems={'center'} flex={'row'}>
                                <Typography fontSize={'16px'} sx={{ mt: -0.6, mr: 1, color: '#666666' }}>Published Date: </Typography>
                                <ListItemText sx={{ fontSize: 100 }}>
                                    <Typography fontSize={'16px'} sx={{ mt: -0.6 }}>{new Date(topic.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>
                                </ListItemText>
                            </Box>
                        </ListItem>
                        <Divider sx={{ width: '100%' }} />
                    </List>
                })}
            </Box>
        </>
    )
})

const getTotalComments = (comments) => {
    let totalComments = 0;
    if (Array.isArray(comments)) {
        totalComments = comments.length;
        comments.forEach(comment => {
            if (Array.isArray(comment.replies)) {
                totalComments += comment.replies.length;
            }
        });
    }
    return totalComments;
}


export default AllTopics