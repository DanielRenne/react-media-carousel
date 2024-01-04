import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import NextIcon from "@mui/icons-material/SkipNext";
import PrevIcon from "@mui/icons-material/SkipPrevious";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

export default function PlayPause(props) {

    const iconSize = props.width - 10;

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title="Previous">
                <Avatar style={{
                    backgroundColor: "black",
                    width: 50,
                    height: 50,
                    position: "relative",
                    boxShadow:
                        "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                }}>
                    <IconButton
                        onClick={(ev) => {
                            ev.stopPropagation();
                            ev.preventDefault();

                            if (props.onPrev) {
                                props.onPrev();
                            }
                        }}
                    >

                        <PrevIcon
                            style={{
                                color: "white",
                                width: iconSize,
                                height: iconSize,
                            }}
                        />

                    </IconButton>
                </Avatar>
            </Tooltip>
            <div style={{ width: 20 }} />
            <Tooltip title={props.paused ? "Play" : "Pause"} >
                <Avatar style={{
                    backgroundColor: "black",
                    width: 50,
                    height: 50,
                    border: "white",
                    borderStyle: "solid",
                    borderWidth: 2,
                    position: "relative",
                    boxShadow:
                        "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                }}>
                    <IconButton
                        onClick={(ev) => {
                            ev.stopPropagation();
                            ev.preventDefault();

                            if (props.onClick) {
                                props.onClick();
                            }
                        }}
                    >
                        {props.paused ? (
                            <PlayIcon
                                style={{
                                    color: "white",
                                    width: iconSize - 10,
                                    height: iconSize - 10,
                                }}
                            />
                        ) : (
                            <PauseIcon
                                style={{
                                    color: "white",
                                    width: iconSize - 10,
                                    height: iconSize - 10,
                                }}
                            />
                        )}
                    </IconButton>
                </Avatar>
            </Tooltip>

            <div style={{ width: 20 }} />
            <Tooltip title="Next">
                <Avatar style={{
                    backgroundColor: "black",
                    width: 50,
                    height: 50,
                    position: "relative",
                    boxShadow:
                        "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
                }}>
                    <IconButton
                        onClick={(ev) => {
                            ev.stopPropagation();
                            ev.preventDefault();

                            if (props.onNext) {
                                props.onNext();
                            }
                        }}
                    >

                        <NextIcon
                            style={{
                                color: "white",
                                width: iconSize,
                                height: iconSize,
                            }}
                        />

                    </IconButton>
                </Avatar>
            </Tooltip>
        </div>
    )
}