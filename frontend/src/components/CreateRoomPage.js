import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Collapse } from '@mui/material';
import Alert from '@mui/lab/Alert';

const CreateRoomPage = (props) => {
    const {
    votesToSkip =  2,
    guestCanPause = true,
    update = false,
    roomCode = null,
    updateCallback = () => {}
  } = props;

    const [isGuestCanPause, setGuestCanPause] = useState(guestCanPause);
    const [isVotesToSkip, setVotesToSkip] = useState(votesToSkip);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleVotesChanged = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true");
    };


    const handleRoomButtonPressed = () => {
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        votes_to_skip: isVotesToSkip,
        guest_can_pause: isGuestCanPause
        }),
        };
        fetch("/api/create-room", requestOptions).then((response) => response.json()).then((data) => navigate('/room/' + data.code));
        
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            votes_to_skip: isVotesToSkip,
            guest_can_pause: isGuestCanPause,
            code: roomCode,
        }),
        };
        fetch("/api/update-room", requestOptions).then((response) => {
            if (response.ok) {
                    setSuccessMsg("Room updated successfully");
            } else {
                setErrorMsg("Error updating the Room");
            }
            updateCallback();
        });
    }

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={handleRoomButtonPressed}>
                    Create A Room
                    </Button>
                </Grid>

                <Grid items xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>
                    Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );
    }


    const title = update ? "Update Room" : "Create a Room"
    
    return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse in={errorMsg != "" || successMsg != ""}>
                        {successMsg != "" ?  (<Alert severity='success' onClose={() => {
                            setSuccessMsg("");
                        }}
                        >{successMsg}
                        </Alert>) : <Alert severity='error' onClose={() => {
                            setErrorMsg("");
                        }}
                        >{errorMsg}
                        </Alert>}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                    {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                            Guest Control of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                            <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement='bottom' />
                            <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement='bottom' />
                        </RadioGroup>
                    </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField required={true} type="number" onChange={handleVotesChanged} defaultValue={votesToSkip} inputProps={{ min: 1, style: { textAlign: "center" } }} />
                    <FormHelperText>
                        <div align="center">Votes Required To Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? renderUpdateButtons() : renderCreateButtons()}
            </Grid>
        );
}

export default CreateRoomPage;