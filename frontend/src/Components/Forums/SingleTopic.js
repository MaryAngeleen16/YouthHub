import React, { useEffect, useState } from 'react'
import { Box, Container, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const SingleTopic = ({ topic }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState();
    const [forumTopic, setForumTopic] = useState({});
    const [relatedTopics, setRelatedTopics] = useState([]);

    const handleClick = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    const getForumTopic = async () => {

        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/single-topic/${topic}`, config)

            console.log(data);
            setForumTopic(data.forumTopic)
            setRelatedTopics(data.relatedTopics)

        } catch (err) {
            console.log(err)
            alert("Error occured")
        }
    }

    useEffect(() => {
        getForumTopic()
    }, [])

    return (
        <>
            <Popper
                // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
                sx={{ zIndex: 1200 }}
                open={open}
                anchorEl={anchorEl}
                placement={placement}
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Button size='small'>Reply</Button>
                            <Button size='small'>Edit</Button>
                        </Paper>
                    </Fade>
                )}
            </Popper>
            <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Card sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                    <CardHeader
                        avatar={
                            // <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" >
                            <img src="/images/lofi.jpg" width={75} height={75} />
                            // </Avatar>
                        }
                        title={<Typography fontSize={20}>{forumTopic?.user?.name}</Typography>}
                        subheader={<Typography fontSize={20}>{new Date(forumTopic.createdAt).toLocaleDateString('en-PH', { month: 'long', day: '2-digit', year: 'numeric' })}</Typography>}
                    />
                    <CardContent sx={{ px: 2.5 }}>

                        <Typography variant='h4'> {forumTopic.title} </Typography>
                        <Typography variant='p' fontSize={20}>in {forumTopic.category?.name}</Typography>


                        <Typography variant="body2" color="text.secondary" fontSize={18} mt={3} maxWidth={800}>
                            {forumTopic.content}
                        </Typography>
                    </CardContent>
                    <Divider sx={{ mx: 2, mt: 3 }} />
                    <Box sx={{ mx: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 800 }}>
                        <Typography sx={{ my: 2 }} fontSize={20}>{forumTopic.userComments?.length} Comments</Typography>
                        <Button variant='contained'>Add Comment</Button>
                    </Box>
                    <Divider sx={{ mx: 2, }} />
                    {forumTopic.userComments && forumTopic.userComments.map(comment => {
                        return (
                            <>
                                <Box px={2} my={4} display={'flex'} alignItems={'center'}>
                                    <img src="/images/lofi.jpg" width={60} height={60} style={{ borderRadius: '50%' }} />
                                    <Box ml={2}>
                                        <Typography fontSize={18} color="text.secondary" maxWidth={800}>{comment.user.name}</Typography>
                                        <Typography fontSize={20} maxWidth={800}>{comment.comment}</Typography>
                                    </Box>
                                    <IconButton sx={{ mt: 2, ml: 2 }} onClick={handleClick('right')}>
                                        <MoreVertIcon fontSize='large' />
                                    </IconButton>
                                </Box>
                                {comment && comment.replies.map(repliedComment => {
                                    return (
                                        <Box px={2} my={4} display={'flex'} alignItems={'center'} pl={10}>
                                            <img src="/images/lofi.jpg" width={60} height={60} style={{ borderRadius: '50%' }} />
                                            <Box ml={2}>
                                                <Typography fontSize={18} color="text.secondary" maxWidth={800}>{repliedComment.user?.name}</Typography>
                                                <Typography fontSize={20} maxWidth={800}>{repliedComment.comment}</Typography>
                                            </Box>
                                            <IconButton sx={{ mt: 2, ml: 2 }}>
                                                <MoreVertIcon fontSize='large' />
                                            </IconButton>
                                        </Box>
                                    )
                                })}
                            </>
                        )
                    })}

                </Card>
                <Box p={2}>
                    {/* <Typography>7 comments</Typography> */}
                    <Typography variant='h6'>Similar Topics</Typography>
                    <Divider />
                    {relatedTopics?.map(topic => {
                        return (
                            <>
                                <Typography sx={{
                                    my: 1, cursor: 'pointer',
                                    "&:hover": {
                                        backgroundColor: "#3C363320", // Change to the desired hover background color
                                        cursor: "pointer", // Change to "pointer" to indicate clickable
                                        transition: "0.3s ease-in-out",
                                    },
                                }}>{topic.title}</Typography>
                                <Divider />
                            </>
                        )
                    })}
                </Box>
            </Container>
        </>
    )
}

export default SingleTopic