import React from "react";
import NextIcon from "@mui/icons-material/SkipNext";
import PrevIcon from "@mui/icons-material/SkipPrevious";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

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
			background-color: #333;
			border-radius: 50%;
			margin: 16px 8px;
			cursor: pointer;
	}

	.active {
			background-color: #bbb;
	}`;

	const slideShow = props.slideShow ? props.slideShow : undefined;

	const centerInteger = (length) => {

		// Check if the length is odd
		if (length % 2 !== 0) {
			// Return the integer at the center
			return { index: Math.floor(length / 2), type: "override" };
		} else {
			// If length is even, there is no single center integer
			return { index: Math.floor(length / 2) - 1, type: "insert" };
		}
	}

	const playButton = centerInteger(props.slides ? props.slides.length : 0)
	const playButtonSize = 40;
	var playButtonDom = (index) => (

		<Tooltip title={props.paused ? "Play" : "Pause"} >
			<div style={{ paddingLeft: 5, paddingRight: 5 }}>
				<Avatar style={{
					backgroundColor: "black",
					width: playButtonSize,
					height: playButtonSize,
					border: "white",
					borderStyle: "solid",
					borderWidth: 2,
					paddingLeft: 5,
					paddingRight: 5,
					position: "relative",
					boxShadow:
						"rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px"
				}}>
					<IconButton
						onClick={(ev) => {
							ev.stopPropagation();
							ev.preventDefault();

							if (props.onPlayPause) {
								props.onPlayPause();
							}
						}}
					>
						{props.paused ? (
							<PlayIcon
								style={{
									color: props.value === index ? "#bbb" : "white",
									width: playButtonSize - 10,
									height: playButtonSize - 10,
								}}
							/>
						) : (
							<PauseIcon
								style={{
									color: props.value === index ? "#bbb" : "white",
									width: playButtonSize - 10,
									height: playButtonSize - 10,
								}}
							/>
						)}
					</IconButton>
				</Avatar>
			</div>
		</Tooltip>
	)

	var prevButton = (
		<Tooltip title="Previous">
			<Avatar style={{
				backgroundColor: "black",
				width: 30,
				height: 30,
				marginTop: 8,
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
							width: 25,
							height: 25,
							cursor: "pointer"
						}}
					/>

				</IconButton>
			</Avatar>
		</Tooltip>
	)

	var nextbutton = (
		<Tooltip title="Next">
			<Avatar style={{
				backgroundColor: "black",
				width: 30,
				height: 30,
				marginTop: 8,
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
							width: 25,
							height: 25,
							cursor: "pointer"
						}}
					/>

				</IconButton>
			</Avatar>
		</Tooltip>
	)

	if (props.slides && props.slides.length < 2) {
		prevButton = null;
		nextbutton = null;
	}

	if (!slideShow) {
		prevButton = null;
		nextbutton = null;
	}

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
				{prevButton}
				{props.slides
					? props.slides.map((slide, i) => {

						const play = playButtonDom(i);
						const bullet = (
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
						)

						if (slideShow) {
							if (playButton.index === i && playButton.type === "override") {
								return play;
							} else if (playButton.index === i && playButton.type === "insert") {
								return (
									<div style={{ display: "flex", justifyContent: "left", alignItems: "center", marginTop: 14 }}>
										{bullet}
										{play}
									</div>
								)
							}
						}

						return bullet;
					})
					: null}
				{nextbutton}
			</div>
		</div>
	);
}
