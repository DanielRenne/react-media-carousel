import React from "react";

export default function Slide(props) {
    const width = props.width ? props.width : 800;
    const height = props.height ? props.height : 600;
    const theme = props.theme;

    return (
        <div
            style={{
                background: theme === "dark" ? "#212121" : "white",
                borderRadius: 15,
                width: width,
                height: height,
                display: "flex",
                justifyContent: "left",
            }}
            onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
            }}
        >
            <div
                style={{
                    width: "60%",
                    background: theme === "dark" ? "#303030" : "#f8f8f8",
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {props.mediaType ? (
                    props.mediaType === "photo" ? (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <img
                                style={{
                                    width: "100%",
                                    maxHeight: "66%",
                                    display: "block",
                                    objectFit: "cover",
                                }}
                                src={props.src}
                            />
                            {props.audioSrc ? (
                                <audio
                                    style={{ position: "absolute", bottom: 5, width: "100%" }}
                                    controls
                                    src={props.audioSrc}
                                    onEnded={() => {
                                        if (props.onAudioEnd) {
                                            props.onAudioEnd();
                                        }
                                    }}
                                    ref={(component) => {
                                        if (component) {
                                            if (props.setActiveAudioPlayer) {
                                                props.setActiveAudioPlayer(component);
                                            }
                                        }
                                    }}
                                ></audio>
                            ) : null}
                        </div>
                    ) : (
                        <video
                            disablePictureInPicture
                            controlsList="timeline volume nodownload noplaybackrate nofullscreen"
                            onEnded={() => {
                                if (props.onVideoEnd) {
                                    props.onVideoEnd();
                                }
                            }}
                            muted={false}
                            preload="metadata"
                            controls
                            ref={(component) => {
                                if (component) {
                                    if (props.setActivePlayer) {
                                        props.setActivePlayer(component);
                                    }
                                }
                            }}
                            width={"100%"}
                        // height={
                        //   Screen.isMobile()
                        //     ? window.innerHeight -
                        //       (props.caption && props.caption !== "" ? 200 : 150)
                        //     : window.innerHeight - 250
                        // }
                        >
                            <source src={props.src + "#t=0.001"} />
                        </video>
                    )
                ) : (
                    <img
                        style={{
                            width: "100%",
                            display: "block",
                        }}
                        src={props.src}
                    />
                )}
            </div>
            <div style={{ width: "3%" }} />
            <div
                style={{
                    width: "35%",
                    background: "transparent",
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                    position: "relative",
                }}
            >
                <div style={{ height: "20%", color: theme === "dark" ? "white" : "black" }} className="aligner">
                    <div style={{ width: "100%" }}>
                        <h2>{props.title}</h2>
                    </div>
                </div>
                <div style={{ height: "75%", color: theme === "dark" ? "white" : "black" }}>
                    <div
                        style={{
                            width: "100%",
                            fontSize: 18,
                            overflow: "auto",
                            height: "100%",
                        }}
                    >
                        {props.story}
                    </div>
                </div>
            </div>
            <div style={{ width: "2%" }} />
        </div>
    );
}
