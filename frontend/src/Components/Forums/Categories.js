import { Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { getToken } from '../../utils/helpers';
import TopicIcon from '@mui/icons-material/Topic';
import axios from 'axios';
import BackDropLoading from '../Layouts/BackDropLoading';

const Categories = ({ setValue, setCategory }) => {

    const [loading, setLoading] = useState();
    const [categories, setCategories] = useState([]);

    const getAllCategories = async () => {
        setLoading(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/forums/categorize/`, config)
            setLoading(false)
            setCategories(data.categorizeForums)

            console.log(data)


        } catch (err) {
            setLoading(false)
            alert("Error occured")
            console.log(err);
        }
    }

    useEffect(() => {

        getAllCategories();

    }, []);

    const goToCategory = (id) => {
        setValue('4');
        setCategory(id);
    }

    return (
        <>
            <BackDropLoading open={loading} />
            <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: 'start', justifyContent: 'start' }}>
                <List sx={{ width: '95%', }}>
                    {categories && categories.map((category) => (
                        <ListItem
                            onClick={() => goToCategory(category.categoryId)}
                            key={category.categoryId}
                            secondaryAction={
                                <>
                                    <TopicIcon fontSize='large' />
                                    <Typography fontSize='large' textAlign={'center'} mt={-1}>{category?.forums.length}</Typography>
                                </>
                            }
                            sx={{
                                mb: 3,
                                "&:hover": {
                                    backgroundColor: "#3C363320", // Change to the desired hover background color
                                    cursor: "pointer", // Change to "pointer" to indicate clickable
                                    transition: "0.3s ease-in-out",
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant='h5' sx={{ mb: 0.5 }}>
                                        {category.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography sx={{ px: 0.3, color: '#666666', fontWeight: 400 }}>
                                        {category.description}
                                    </Typography>
                                }
                            />
                        </ListItem>

                    ))}
                </List>
            </Container>
        </>
    )
}

export default Categories