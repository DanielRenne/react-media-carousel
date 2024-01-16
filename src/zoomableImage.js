import React, { useState } from "react";

export default function ZoomableImage(props) {
    const [scale, setScale] = useState(1);

    const handleZoom = () => {
        setScale((prevScale) => (prevScale === 1 ? 2 : 1)); // Toggle between 1x and 2x zoom
    };

    var style = { ...props.style };
    style.cursor = "pointer";
    style.transform = `scale(${scale})`;
    style.transition = "transform 0.3s ease-out";
    style.position = "relative";
    style.zIndex = scale === 1 ? 0 : 2;

    return (
        <img
            src={props.src}
            alt="Zoomable Image"
            style={style}
            onClick={handleZoom}
        />

    );
}