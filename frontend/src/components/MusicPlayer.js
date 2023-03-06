import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography, Card, Collapse} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Alert from '@mui/lab/Alert';


const MusicPlayer = (props) => {

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const skipSong = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/spotify/skip", requestOptions);
    }


    const pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        };
        fetch("/spotify/pause", requestOptions).then((response) => {
            if (!response.ok) {
                setErrorMsg("You don't have playback control. Ask host to grant you control");
            }
        });
    }

    const playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        };
        fetch("/spotify/play", requestOptions);
    }

    const songProgress = (props.time / props.duration) * 100;

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item xs={12} align="center">
                    <Collapse in={errorMsg != ""}>
                        <Alert severity='error' onClose={() => {
                            setErrorMsg("");
                        }}
                        >{errorMsg}
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item align="center" xs={4}>
                    <img src={props.image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {props.artist}
                    </Typography>
                    <div>
                        <IconButton onClick={() => {props.is_playing ? pauseSong() : playSong()}} >
                            {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={() => skipSong()}>
                            {props.votes} / {props.votes_required}
                            <SkipNextIcon /> 
                        </IconButton>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={songProgress} color="secondary" />
                </Grid>
            </Grid>
        </Card>
    );
}

export default MusicPlayer;