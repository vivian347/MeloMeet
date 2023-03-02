import React, { useState, useEffect } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room"
import { BrowserRouter as Router, Routes, Route, Link, Navigate, } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3d2622'
        },
        secondary: {
            main: '#bf360c'
        },
    },
});


const HomePage = () => {
    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        async function fetchRoomCode() {
            const response = fetch('/api/user-in-room');
            const data = await (await response).json();
            setRoomCode(data.code);
        }
        fetchRoomCode();
    }, []);

    const renderHomePage = () => {
        return (
            <ThemeProvider theme={theme}>
                <Grid container spacing={3}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h3" compact="h3">
                            MeloMeet
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <ButtonGroup disableElevation variant='contained' color='primary'>
                            <Button color="primary" to="/join" component={ Link }>
                                Join a Room
                            </Button>
                            <Button color="secondary" to="/create" component={ Link }>
                                Create a Room
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <Typography variant="body1" compact="body1" lineHeight={1.5} fontSize={18}>
                            Welcome to MeloMeet, the perfect platform for music lovers who want to jam together in virtual rooms. With one user acting as host, others can join the room using a code, and everyone can play their favorite music in sync with each other. Whether you're a musician, a casual listener, or just looking for a fun way to connect with friends through music, our website offers an immersive and engaging experience for all. Join today and start jamming!"
                        </Typography>
                    </Grid>
                </Grid>
            </ThemeProvider>
        )
    } 

    const clearRoomCode = () => {
        setRoomCode(null);
    };

    return (
    <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route exact path='/' element = {roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()
                }
                />
                <Route path='/join'
                    element={<RoomJoinPage />}
                />
                <Route path='/create'
                    element={<CreateRoomPage />}
                />
                <Route path='/room/:roomCode'
                    element={<Room leaveRoomCallback={clearRoomCode} />}
                />
            </Routes>
        </Router>
    </ThemeProvider>
    );
};

export default HomePage;