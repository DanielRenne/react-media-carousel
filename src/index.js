import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Backdrop } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import Slide from './slide';
import SlideAnimation from './slideAnimation';
import NavDots from './navDots';

export default function useMediaCarousel(props) {
    const [open, setOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [slidingLeft, setSlidingLeft] = useState(false);
    const [slidingRight, setSlidingRight] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const activeVideoPlayer = useRef();
    const activeAudioPlayer = useRef();

    const slides = props.slides ? props.slides : [];
    const width = 5 * (window.innerWidth / 9);
    const height = 5 * (window.innerHeight / 8);

    const pauseActiveMedia = React.useCallback(() => {
        if (activeVideoPlayer.current) {
            activeVideoPlayer.current.pause();
        }
        if (activeAudioPlayer.current) {
            activeAudioPlayer.current.pause();
        }
    }, [activeVideoPlayer, activeAudioPlayer]);

    const onKeyDown = React.useCallback(
        (event) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.key === 'ArrowRight') {
                if (activeSlide === slides.length - 1) {
                    return;
                }
                pauseActiveMedia();
                setSlidingLeft(true);
            }
            if (event.key === 'ArrowLeft') {
                if (activeSlide === 0) {
                    return;
                }
                pauseActiveMedia();
                setSlidingRight(true);
            }
            if (event.key === 'Escape') {
                close();
            }
            if (event.key === ' ') {
                if (activeVideoPlayer.current) {
                    if (activeVideoPlayer.current.paused) {
                        activeVideoPlayer.current.play();
                    } else {
                        activeVideoPlayer.current.pause();
                    }
                }
                if (activeAudioPlayer.current) {
                    if (activeAudioPlayer.current.paused) {
                        activeAudioPlayer.current.play();
                    } else {
                        activeAudioPlayer.current.pause();
                    }
                }
            }
        },
        [activeSlide, close, pauseActiveMedia, slides.length],
    );

    useEffect(() => {
        if (slidingLeft || slidingRight) {
            activeAudioPlayer.current = undefined;
            activeVideoPlayer.current = undefined;
        }
    }, [slidingLeft, slidingRight]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    const close = React.useCallback(() => {
        setOpen(false);
        if (activeVideoPlayer.current) {
            activeVideoPlayer.current.pause();
        }
        if (activeAudioPlayer.current) {
            activeAudioPlayer.current.pause();
        }
    }, [activeVideoPlayer, activeAudioPlayer]);

    return [
        // eslint-disable-next-line react/jsx-key
        <Backdrop
            sx={{ color: '#fff', zIndex: 9999 }}
            open={open}
            onClick={() => {
                close();
            }}
        >
            {slides.length < 1 ? (
                <div>No Slides available.</div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* The Left Slide Off Screen Animation */}
                    {activeSlide > 1 && (slidingRight || slidingLeft) ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: slidingRight ? (width * 2 + 60) * -1 : width * 2 + 60,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation distance={width + 60}>
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide - 2].story}
                                    title={slides[activeSlide - 2].title}
                                    src={slides[activeSlide - 2].src}
                                    mediaType={slides[activeSlide - 2].mediaType}
                                />
                            </SlideAnimation>
                        </div>
                    ) : null}

                    {/* The Left Slide Animation */}
                    {activeSlide > 0 && (slidingRight || slidingLeft) ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: slidingRight ? (width + 60) * -1 : width + 60,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={width + 60}
                                onAnimationEnd={() => {
                                    if (slidingRight) {
                                        setSlidingRight(false);
                                        setActiveSlide(activeSlide - 1);
                                    }
                                }}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide - 1].story}
                                    title={slides[activeSlide - 1].title}
                                    src={slides[activeSlide - 1].src}
                                    mediaType={slides[activeSlide - 1].mediaType}
                                />
                            </SlideAnimation>
                        </div>
                    ) : null}

                    {/* The Left Slide */}
                    {activeSlide > 0 && !slidingLeft && !slidingRight ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: (width + 60) * -1,
                                top: 0,
                                background: 'white',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                            onMouseEnter={() => {
                                setShowLeftArrow(true);
                            }}
                            onMouseLeave={() => {
                                setShowLeftArrow(false);
                            }}
                            onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width,
                                    height,
                                }}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide - 1].story}
                                    title={slides[activeSlide - 1].title}
                                    src={slides[activeSlide - 1].src}
                                    mediaType={slides[activeSlide - 1].mediaType}
                                />
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    background: 'black',
                                    opacity: '60%',
                                    border: '1px solid black',
                                    borderRadius: 15,
                                    width,
                                    height,
                                }}
                            />
                            <div
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    pauseActiveMedia();
                                    setSlidingRight(true);
                                }}
                                style={{
                                    position: 'absolute',
                                    display: showLeftArrow ? 'flex' : 'none',
                                    top: height / 2,
                                    left: width - width / 10,
                                    background: 'hsla(0,0%,100%,.25)',
                                    opacity: 20,
                                    border: '1px solid black',
                                    borderRadius: 5,
                                    width: height / 9,
                                    height: height / 9,
                                    zIndex: 1,
                                    cursor: 'pointer',
                                }}
                                className="aligner"
                            >
                                <div
                                    style={{
                                        background: 'transparent',

                                        border: '1px solid black',
                                        borderRadius: 0,
                                        width: height / 10,
                                        height: height / 10,
                                        zIndex: 1,
                                    }}
                                    className="aligner"
                                >
                                    <KeyboardArrowLeftIcon
                                        style={{ fontSize: 36, color: 'white', zIndex: 2 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* The Active Slide Animation */}

                    {slidingLeft || slidingRight ? (
                        <SlideAnimation distance={(width + 60) * (slidingLeft ? -1 : 1)}>
                            <div
                                style={{
                                    background: 'black',
                                    opacity: '80%',
                                    border: '1px solid black',
                                    borderRadius: 15,
                                    width,
                                    height,
                                }}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide].story}
                                    title={slides[activeSlide].title}
                                    src={slides[activeSlide].src}
                                    mediaType={slides[activeSlide].mediaType}
                                />
                            </div>
                        </SlideAnimation>
                    ) : null}

                    {/* The Active Slide */}
                    {slidingLeft || slidingRight ? (
                        <div style={{ width, height }} />
                    ) : (
                        <Slide
                            width={width}
                            height={height}
                            story={slides[activeSlide].story}
                            title={slides[activeSlide].title}
                            src={slides[activeSlide].src}
                            mediaType={slides[activeSlide].mediaType}
                            onVideoEnd={() => {
                                setSlidingLeft(true);
                            }}
                            onAudioEnd={() => {
                                setSlidingLeft(true);
                            }}
                            setActivePlayer={(component) => {
                                activeVideoPlayer.current = component;
                            }}
                            setActiveAudioPlayer={(component) => {
                                activeAudioPlayer.current = component;
                            }}
                            audioSrc={slides[activeSlide].audioSrc}
                        />
                    )}

                    {/* The Right Slide */}
                    {slides.length > activeSlide + 1 && !slidingLeft && !slidingRight ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: width + 60,
                                top: 0,
                                background: 'white',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                            onMouseEnter={() => {
                                setShowRightArrow(true);
                            }}
                            onMouseLeave={() => {
                                setShowRightArrow(false);
                            }}
                            onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width,
                                    height,
                                }}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide + 1].story}
                                    title={slides[activeSlide + 1].title}
                                    src={slides[activeSlide + 1].src}
                                    mediaType={slides[activeSlide + 1].mediaType}
                                />
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    background: 'black',
                                    opacity: '60%',
                                    border: '1px solid black',
                                    borderRadius: 15,
                                    width,
                                    height,
                                }}
                            />
                            <div
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    ev.preventDefault();
                                    pauseActiveMedia();
                                    setSlidingLeft(true);
                                }}
                                style={{
                                    position: 'absolute',
                                    display: showRightArrow ? 'flex' : 'none',
                                    top: height / 2,
                                    left: width / 10,
                                    background: 'hsla(0,0%,100%,.25)',
                                    opacity: 20,
                                    border: '1px solid black',
                                    borderRadius: 5,
                                    width: height / 9,
                                    height: height / 9,
                                    zIndex: 1,
                                    cursor: 'pointer',
                                }}
                                className="aligner"
                            >
                                <div
                                    style={{
                                        background: 'transparent',

                                        border: '1px solid black',
                                        borderRadius: 0,
                                        width: height / 10,
                                        height: height / 10,
                                        zIndex: 1,
                                    }}
                                    className="aligner"
                                >
                                    <KeyboardArrowRightIcon
                                        style={{ fontSize: 36, color: 'white', zIndex: 2 }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* The Right Slide Animation */}
                    {slides.length > activeSlide + 1 && (slidingLeft || slidingRight) ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: width + 60,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={slidingLeft ? (width + 60) * -1 : width + 60}
                                onAnimationEnd={() => {
                                    if (slidingLeft) {
                                        setSlidingLeft(false);
                                        setActiveSlide(activeSlide + 1);
                                    }
                                }}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide + 1].story}
                                    title={slides[activeSlide + 1].title}
                                    src={slides[activeSlide + 1].src}
                                    mediaType={slides[activeSlide + 1].mediaType}
                                />
                            </SlideAnimation>
                        </div>
                    ) : null}

                    {/* The Right Slide Off Screen Animation */}
                    {slides.length > activeSlide + 2 && (slidingLeft || slidingRight) ? (
                        <div
                            style={{
                                position: 'absolute',
                                left: (width + 60) * 2,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={slidingLeft ? (width + 60) * -1 : width + 60}
                            >
                                <Slide
                                    width={width}
                                    height={height}
                                    story={slides[activeSlide + 2].story}
                                    title={slides[activeSlide + 2].title}
                                    src={slides[activeSlide + 2].src}
                                    mediaType={slides[activeSlide + 2].mediaType}
                                />
                            </SlideAnimation>
                        </div>
                    ) : null}
                    <div
                        style={{
                            position: 'absolute',
                            top: height + 10,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <NavDots
                            slides={slides}
                            value={activeSlide}
                            onClick={(index) => {
                                pauseActiveMedia();
                                activeAudioPlayer.current = undefined;
                                activeVideoPlayer.current = undefined;

                                setActiveSlide(index);
                            }}
                        />
                    </div>
                </div>
            )}
        </Backdrop>,
        () => {
            setOpen(true);
        },
    ];
}
