import React, { useEffect, useState } from 'react'
import { Box, Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';

const CategoryTopics = ({ category }) => {

    const [forumTopics, setForumTopics] = useState([]);

    const getAllTopics = async () => {

        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/all-topics?category=${category}`, config);

            setForumTopics(data.forumTopics);


        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllTopics();
    }, []);

    console.log(forumTopics)

    return (
        <Container maxWidth='xl'>
            <Box height={120} bgcolor={'#3C363320'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Typography variant='h4' textAlign={'center'} width={'80%'}>Pregnancy</Typography>
                <Typography textAlign={'center'} width={'80%'}>For mothers only</Typography>
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
                                <Typography variant='h5' sx={{ mb: 0.5 }}>{topic.title}</Typography>
                            } secondary={
                                <Typography sx={{ px: 0.3, color: '#666666', fontWeight: 400 }}>
                                    {topic.user.name} · {topic.category.name}
                                </Typography>
                            } />
                            <Box display={'flex'} alignItems={'center'} flex={'row'} mr={10}>
                                <ChatBubbleOutline sx={{ mr: 1.5, color: '#666666' }} fontSize='medium' />
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
        </Container>
    )
}

export default CategoryTopics