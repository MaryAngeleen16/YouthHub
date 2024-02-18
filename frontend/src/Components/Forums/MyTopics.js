import { Button, ButtonGroup, Container, Typography, Box } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { getToken, getUser } from '../../utils/helpers';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Delete, Message, Visibility } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import BackDropLoading from '../Layouts/BackDropLoading';

const MyTopics = memo(({ setTopic, setValue }) => {

    const [topics, setTopics] = useState();
    const [loading, setLoading] = useState();

    const navigate = useNavigate()

    const columns = [
        {
            name: "image",
            label: "Image",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    console.log(value)
                    return <img src={value?.url} style={{ width: 75, height: 75 }} />
                }
            },
        },
        {
            name: "title",
            label: "Title",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "content",
            label: "Content",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    if (value.length <= 20) {
                        return value
                    } else {
                        return value.substring(0, 20) + '...';
                    }
                }
            },
        },
        {
            name: "category",
            label: "Category",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return value.name;
                }
            },

        },
        {
            name: "userComments",
            label: "Comments",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    let totalComments = 0;
                    if (Array.isArray(value)) {
                        totalComments = value.length;
                        value.forEach(comment => {
                            if (Array.isArray(comment.replies)) {
                                totalComments += comment.replies.length;
                            }
                        });
                    }
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Message fontSize='large' />
                            <Typography fontSize={'20px'} ml={1}>
                                {totalComments}
                            </Typography>
                        </Box>
                    );
                }
            }
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <ButtonGroup variant="text" aria-label="text button group">
                            <Button size='large' onClick={() => gotoSingleTopic(value)}> <Visibility fontSize='large' /></Button>
                            <Button size='large' onClick={() => navigate(`/edit/topic/${value}`)}><EditIcon fontSize='large' /></Button>
                            <Button size='large' onClick={() => deleteTopic(value)}><Delete fontSize='large' /></Button>
                        </ButtonGroup>
                    )
                }
            }
        }
    ];

    const getMyTopics = async () => {

        setLoading(true)

        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }

        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/all-topics?user=${getUser()._id}`, config);
            setLoading(false)
            let tableData = []

            data.forumTopics.forEach(topic => {
                tableData.push({
                    image: topic.image,
                    title: topic.title,
                    content: topic.content,
                    category: topic.category,
                    userComments: topic.userComments,
                    actions: topic._id,
                })
            })

            setTopics(tableData);

        } catch (err) {
            setLoading(false)
            alert("Error occured")
            console.log(err);
        }

    }

    useEffect(() => {
        getMyTopics()
    }, [])

    const options = {
        filterType: 'textfield',
        selectableRows: false
    };

    const getMuiTheme = () => createTheme({
        components: {
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        fontSize: 20,
                        height: 75
                    }
                }
            },
            MUIDataTableHeadCell: {
                styleOverrides: {
                    root: {
                        backgroundColor: "transparent",
                        fontSize: 20,
                    }
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: "transparent",
                        boxShadow: 'none',
                    }
                }
            }
        }
    })

    const deleteTopic = async (id) => {
        if (window.confirm("Do you want to delete this item? ")) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            try {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/forum/delete/${id}`, config)

                getMyTopics();

            } catch (err) {
                console.log(err);
                alert("Error occured")
            }
        } else {

        }

    }

    const gotoSingleTopic = (id) => {
        console.log(id)
        setTopic(id)
        setValue('5')
    }
    console.log(loading)
    return (
        <>
            <BackDropLoading open={loading} />
            <Container maxWidth='xl'>
                <ThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"My Topics"}
                        data={topics}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </Container>
        </>
    )
})

export default MyTopics