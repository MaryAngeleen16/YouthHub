import React, { useEffect, useState } from 'react'
import Navbar from '../Layouts/navBar'
import { Container, Divider, InputBase, ThemeProvider, Typography, Select, MenuItem, Button, Paper } from '@mui/material'
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
import Categories from './Categories';
import CategoryTopics from './CategoryTopics';
import SingleTopic from './SingleTopic';
import MyTopics from './MyTopics';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

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
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    {
        title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
        year: 1964,
    },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    {
        title: 'Star Wars: Episode VI - Return of the Jedi',
        year: 1983,
    },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        year: 2004,
    },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];

const Forum = () => {

    const [value, setValue] = useState('3');
    const [category, setCategory] = useState('asd');
    const [topic, setTopic] = useState('');
    const [allTopics, setAllTopics] = useState([]);
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [keyword, setKeyword] = useState('')
    const [filteredCategories, setFilteredCategies] = useState([])

    const [open, setOpen] = React.useState(false);
    const [success, setSuccess] = useState(false);
    const [newTopic, setNewTopic] = useState({
        title: '',
        category: '',
        content: '',
        image: '',
    })

    const [sortType, setSortType] = useState('ra')

    const getSearchableTopics = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/forum/all-topics`, config);
            console.log(data)
            setAllTopics(data.forumTopics)

        } catch (err) {
            console.log(err)
            alert("Error occured")
        }
    }

    // const getSearchableCategories = async () => {
    //     const config = {
    //         headers: {
    //             'Authorization': `Bearer ${getToken()}`
    //         }
    //     }
    //     try {

    //         const { data } = await axios.get(`${process.env.REACT_APP_API}/categories/`, config)
    //         console.log(data)
    //         setAllCategies(data.categories)

    //     } catch (err) {
    //         console.log(err)
    //         alert("Error occured")
    //     }
    // }

    useEffect(() => {
        getSearchableTopics();
        // getSearchableCategories()
    }, [])

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

    const gotoSingleTopic = (id) => {
        document.getElementById('free-solo-demo').value = ''
        // setKeyword('')
        setTopic(id)
        setValue('5')
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
                <Container maxWidth='xl' sx={{ backgroundColor: 'FFFFFF', overflow: 'auto' }}>
                    <Box sx={{ width: '100%', typography: 'body1' }} mt={5} mb={20}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }} px={2}>
                                <TabList onChange={handleChange} indicatorColor='dark' textColor='secondary'>
                                    <Tab label="Categories" value="1" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                    <Tab label="All Topics" value="2" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                    <Tab label="My Topics" value="3" sx={{ fontWeight: 400, textTransform: 'capitalize', fontSize: 16 }} />
                                    {/* <Tab label="" hidden value="4" /> */}
                                </TabList>
                                <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: '#F6B6A5', height: 35, width: '30%' }} my={'auto'} pl={1.5}>
                                    <SearchIcon sx={{ color: 'action.active', mr: 0, my: 0.5 }} />
                                    <Autocomplete
                                        id="free-solo-demo"
                                        freeSolo
                                        options={allTopics}
                                        getOptionLabel={(option) => option.title}
                                        renderInput={(params) => <TextField id="keyword"{...params} placeholder="Search" variant='standard' />}
                                        size='small'
                                        fullWidth
                                        sx={{ pr: 2 }}
                                        renderOption={(props, option) => {
                                            return <li {...props} onClick={() => gotoSingleTopic(option._id)}>
                                                <Typography>{option.title}</Typography>
                                            </li>
                                        }}
                                    />
                                </Box>
                            </Box>
                            {value !== '1' && value !== '4' && value !== '5' ?
                                < Container maxWidth='xl' sx={{ my: 3, mt: 5 }}>
                                    <Box component={'div'} sx={{ display: 'flex', px: 3 }}>
                                        {value !== '3' ?
                                            <>
                                                <Typography variant='body1' sx={{ fontWeight: 400, mr: 1 }} color={'#666666'}>Sort by: </Typography>
                                                <Select
                                                    variant='standard'
                                                    label="Age"
                                                    size='small'
                                                    value={sortType}
                                                    defaultValue={sortType}
                                                    sx={{ fontSize: 16, height: 26, border: 'none', borderBottom: 'none', mr: 'auto' }}
                                                    onChange={e => setSortType(e.target.value)}
                                                >
                                                    <MenuItem value={'ra'}>Recent Activity</MenuItem>
                                                    <MenuItem value={'nto'}>Newest to oldest</MenuItem>
                                                    <MenuItem value={'otn'}>Oldest to newest</MenuItem>
                                                </Select>
                                            </>
                                            : ""
                                        }

                                        <Button variant='contained' sx={{
                                            // borderColor: '#F6B6A5',
                                            // textTransform: 'capitalize',
                                            // color: '#F6B6A5',
                                            // '&:hover': {
                                            //     borderColor: '#F6B6A5',
                                            //     color: '#F6B6A5'
                                            // },
                                        }} onClick={handleClickOpen}
                                        >Create New Topic</Button>
                                    </Box>
                                </Container> : ''
                            }
                            <Divider />
                            <TabPanel value="1">
                                <Categories setValue={setValue} setCategory={setCategory} />
                            </TabPanel>
                            <TabPanel value="2" sx={{ pt: 1 }}>
                                <AllTopics key={success} setTopic={setTopic} setValue={setValue} sortType={sortType} setCategory={setCategory} />
                            </TabPanel>
                            <TabPanel value="3">
                                <MyTopics key={success} setValue={setValue} setTopic={setTopic} />
                            </TabPanel>
                            <TabPanel value="4">
                                <CategoryTopics category={category} setTopic={setTopic} setValue={setValue} />
                            </TabPanel>
                            <TabPanel value="5">
                                <SingleTopic topic={topic} setValue={setValue} setTopic={setTopic} setCategory={setCategory} />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Container>
            </ThemeProvider >
        </>
    )
}

export default Forum