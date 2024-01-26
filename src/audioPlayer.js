import React, { useRef, useState } from "react";

import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import VolumeUnmuted from "@mui/icons-material/VolumeUpOutlined";
import VolumeOff from "@mui/icons-material/VolumeOffOutlined";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Util from "./util";

export default function AudioPlayer(props) {
    const [paused, setPaused] = useState(true);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [trackDuration, setTrackDuration] = useState(60);
    const [duration, setDuration] = useState(Infinity);
    const [volume, setCurrentVolume] = useState(1.0);
    const theme = props.theme;
    const controlColor = theme == "dark" ? "white" : "black";
    const audioPlayer = useRef();

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 10
            }}
        >

            <audio
                style={{ display: "none" }}
                preload="auto"
                src={props.src}
                ref={(component) => {
                    if (component) {
                        audioPlayer.current = component;
                        if (props.onLoaded) {
                            props.onLoaded(component);
                        }
                    }
                }}
                onLoadedMetadata={() => {

                    if (isNaN(audioPlayer.current.duration) || audioPlayer.current.duration === "Infinity" || audioPlayer.current.duration === Infinity) {
                        setDuration(Infinity);
                        setTrackDuration(60);
                        return;
                    }

                    setDuration(audioPlayer.current.duration);
                    setTrackDuration(audioPlayer.current.duration);


                }}
                onEnded={() => {
                    if (props.onEnded) {
                        props.onEnded();
                    }
                }}
                onPlay={() => {
                    setPaused(false);
                    setMuted(false);
                }}
                onPause={() => {
                    setPaused(true);
                }}
                onTimeUpdate={() => {

                    var currentTime = parseInt(audioPlayer.current.currentTime);

                    setCurrentSeconds(currentTime);
                    setCurrentTime(Util.secondsToMinuteSecond(currentTime));

                    if (isNaN(audioPlayer.current.duration) || audioPlayer.current.duration === "Infinity" || audioPlayer.current.duration === Infinity) {
                        if (trackDuration - currentTime < 5) {
                            setTrackDuration(trackDuration + 60);
                        }
                        return;
                    }
                }}
            ></audio>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "left", alignContent: "center", width: "100%" }}>
                            <IconButton
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (audioPlayer && audioPlayer.current) {
                                        if (paused === true) {
                                            audioPlayer.current.play();
                                            audioPlayer.current.muted = false;
                                        } else {
                                            audioPlayer.current.pause();
                                        }
                                    }
                                }}
                                style={{ padding: 0 }}
                            >
                                {paused ? (
                                    <PlayIcon
                                        style={{
                                            color: controlColor,
                                            width: 25,
                                            height: 25,
                                        }}
                                    />
                                ) : (
                                    <PauseCircleIcon
                                        style={{
                                            color: controlColor,
                                            width: 25,
                                            height: 25,
                                        }}
                                    />
                                )}
                            </IconButton>
                            <div
                                className="alignerRight"
                                style={{
                                    color: controlColor,
                                    display: "flex",
                                    justifyContent: "left",
                                    alignItems: "center"
                                }}
                            >
                                <div style={{ marginLeft: 10, marginRight: 10 }}>{currentTime}</div>
                                <div>/</div>
                                <div style={{ marginLeft: 10 }}>
                                    {Util.secondsToMinuteSecond(duration)}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "left", alignContent: "center", width: "33%" }}>
                            <Slider
                                style={{
                                    marginRight: 15,
                                    height: 0
                                }}
                                sx={{
                                    '& .MuiSlider-root': {
                                        color: controlColor,
                                    },
                                    '& .MuiSlider-rail': {
                                        height: "3px !important",
                                        color: controlColor,
                                        backgroundColor: controlColor,
                                    },
                                    '& .MuiSlider-track': {
                                        height: "3px !important",
                                        color: controlColor,
                                        backgroundColor: controlColor,
                                    },
                                    '& .MuiSlider-thumb': {
                                        height: "8px !important",
                                        width: "8px !important",
                                        backgroundColor: controlColor,
                                        color: controlColor,
                                    },
                                }}

                                aria-label="Volume"
                                value={muted === true ? 0 : volume}
                                onChange={(event, value) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    if (audioPlayer) {
                                        if (volume > 0) {
                                            audioPlayer.current.muted = false;
                                            setMuted(false);
                                        }
                                        audioPlayer.current.volume = value;
                                        setCurrentVolume(value);
                                    }
                                }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                }}
                                step={0.1}
                                min={0}
                                max={1.0}
                            />
                            <IconButton
                                style={{
                                    marginTop: Util.isMobile() ? 6 : Util.isSafari() ? 5 : 2,
                                    padding: 0
                                }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    ev.preventDefault();

                                    if (audioPlayer) {
                                        if (muted === false) {
                                            audioPlayer.current.muted = true;
                                            setMuted(true);
                                        } else {
                                            audioPlayer.current.muted = false;
                                            setMuted(false);
                                        }
                                    }

                                }}
                            >
                                {muted ? (
                                    <VolumeOff style={{ color: controlColor, width: 25, height: 25 }} />
                                ) : (
                                    <VolumeUnmuted
                                        style={{ color: controlColor, width: 25, height: 25 }}
                                    />
                                )}
                            </IconButton>
                        </div>
                    </div>
                    <Slider

                        style={{
                            width: "100%",
                            paddingBottom: 0,
                            height: 0
                        }}
                        sx={{
                            '& .MuiSlider-root': {
                                color: controlColor,
                            },
                            '& .MuiSlider-rail': {
                                height: "3px !important",
                                color: controlColor,
                                backgroundColor: controlColor,
                            },
                            '& .MuiSlider-track': {
                                height: "3px !important",
                                color: controlColor,
                                backgroundColor: controlColor,
                            },
                            '& .MuiSlider-thumb': {
                                height: "8px !important",
                                width: "8px !important",
                                backgroundColor: controlColor,
                                color: controlColor,
                            },
                        }}

                        aria-label="Location"
                        value={currentSeconds}
                        onChange={(event, value) => {
                            if (audioPlayer) {
                                if (isNaN(value)) {
                                    setCurrentSeconds(0);
                                    return;
                                }
                                audioPlayer.current.currentTime = value;
                                setCurrentSeconds(value);
                            }
                        }}
                        min={0}
                        max={trackDuration}
                    />
                </div>


            </div>
        </div >
    );
}
