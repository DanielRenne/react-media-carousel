import React from "react";

export default function NavDots(props) {
    const dotStyles = `.dot-container {
    height:30px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.dot {
    height: 12px;
    width: 12px;
    background-color: #bbb;
    border-radius: 50%;
    margin: 0 8px;
    cursor: pointer;
}

.active {
    background-color: #333;
}`;

    return (
        <div>
            <style>{dotStyles}</style>
            <div
                className="dot-container"
                onClick={(ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                }}
            >
                {props.slides
                    ? props.slides.map((slide, i) => {
                        return (
                            <div
                                key={"slideBullet" + i}
                                className={props.value === i ? "active dot" : "dot"}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    if (props.onClick) {
                                        props.onClick(i);
                                    }
                                }}
                            ></div>
                        );
                    })
                    : null}
            </div>
        </div>
    );
}
