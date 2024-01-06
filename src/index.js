import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Backdrop } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import Slide from './slide';
import SlideAnimation from './slideAnimation';
import NavDots from './navDots';
import PlayPause from './playPause';
import Util from "./util";

export default function useMediaCarousel(props) {
    const [open, setOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [slidingLeft, setSlidingLeft] = useState(false);
    const [slidingRight, setSlidingRight] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [paused, setPaused] = useState();


    const theme = props.theme ? props.theme : "light";
    const slideDuration = props.slideDuration ? props.slideDuration : 5000;
    const slideShow = props.slideShow ? props.slideShow : false;
    const editing = props.editing ? props.editing : false;

    const activeVideoPlayer = useRef();
    const activeAudioPlayer = useRef();
    const activeSlideshowTimer = useRef();

    const slides = props.slides ? props.slides : [];
    const slideGap = Util.isMobile() ? 10 : 60;
    const width = Util.isMobile() ? window.innerWidth - 40 : 5 * (window.innerWidth / 9);
    const height = Util.isMobile() ? window.innerHeight - 200 : 5 * (window.innerHeight / 8);

    const togglePlayPause = React.useCallback(() => {
        if (paused) {

            if (activeVideoPlayer.current) {
                activeVideoPlayer.current.play();
            } else if (activeAudioPlayer.current) {
                activeAudioPlayer.current.play();
            } else {
                setSlidingLeft(true);
            }
            setPaused(false);
        } else {

            if (activeVideoPlayer.current) {
                activeVideoPlayer.current.pause();
            } else if (activeAudioPlayer.current) {
                activeAudioPlayer.current.pause();
            } else {
                if (activeSlideshowTimer.current) {
                    clearTimeout(activeSlideshowTimer.current);
                }
            }
            setPaused(true);
        }

    }, [activeVideoPlayer, activeAudioPlayer, paused]);

    const pauseActiveMedia = React.useCallback(() => {
        if (activeVideoPlayer.current) {
            activeVideoPlayer.current.pause();
        } else if (activeAudioPlayer.current) {
            activeAudioPlayer.current.pause();
        } else {
            if (slideShow) {
                if (paused) {
                    setPaused(true);
                }
            }
        }
    }, [activeVideoPlayer, activeAudioPlayer, paused, slideShow]);

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
                        setPaused(false);
                    } else {
                        activeVideoPlayer.current.pause();
                        setPaused(true);
                    }
                } else if (activeAudioPlayer.current) {
                    if (activeAudioPlayer.current.paused) {
                        activeAudioPlayer.current.play();
                        setPaused(false);
                    } else {
                        activeAudioPlayer.current.pause();
                        setPaused(true);
                    }
                } else {
                    if (slideShow) {
                        if (paused) {
                            setPaused(false);
                            setSlidingLeft(true);
                        } else {
                            setPaused(true);
                        }
                    }

                }
            }
        },
        [activeSlide, close, pauseActiveMedia, slides.length, paused, slideShow, activeAudioPlayer, activeVideoPlayer],
    );

    useEffect(() => {
        if (slidingLeft || slidingRight) {
            activeAudioPlayer.current = undefined;
            activeVideoPlayer.current = undefined;
            if (activeSlideshowTimer.current) {
                clearTimeout(activeSlideshowTimer.current);
            }
        }
    }, [slidingLeft, slidingRight]);

    useEffect(() => {
        if (activeSlideshowTimer.current) {
            clearTimeout(activeSlideshowTimer.current);
        }
        if (slideShow && open) {
            if (paused) {
                return;
            }
            if (activeVideoPlayer.current) {
                activeVideoPlayer.current.play();
            } else if (activeAudioPlayer.current) {
                activeAudioPlayer.current.play()
            } else {
                if (activeSlide === slides.length - 1) {
                    return;
                }
                activeSlideshowTimer.current = setTimeout(() => {
                    setSlidingLeft(true);
                }, slideDuration)
            }
        }


    }, [activeSlide, slideShow, open, slides, paused]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    const close = React.useCallback(() => {
        setOpen(false);
        if (activeSlideshowTimer.current) {
            clearTimeout(activeSlideshowTimer.current);
        }
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
                                left: slidingRight ? (width * 2 + slideGap) * -1 : width * 2 + slideGap,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation distance={width + slideGap}>
                                <Slide

                                    theme={theme}
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
                                left: slidingRight ? (width + slideGap) * -1 : width + slideGap,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={width + slideGap}
                                onAnimationEnd={() => {
                                    if (slidingRight) {
                                        setSlidingRight(false);
                                        setActiveSlide(activeSlide - 1);
                                    }
                                }}
                            >
                                <Slide
                                    theme={theme}
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
                                left: (width + slideGap) * -1,
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
                                    theme={theme}
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
                        <SlideAnimation distance={(width + slideGap) * (slidingLeft ? -1 : 1)}>
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
                                    theme={theme}
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
                            editing={editing}
                            theme={theme}
                            width={width}
                            height={height}
                            story={slides[activeSlide].story}
                            title={slides[activeSlide].title}
                            src={slides[activeSlide].src}
                            mediaType={slides[activeSlide].mediaType}
                            onVideoEnd={() => {
                                if (activeSlide === slides.length - 1) {
                                    return;
                                }
                                setSlidingLeft(true);
                            }}
                            onAudioEnd={() => {
                                if (activeSlide === slides.length - 1) {
                                    return;
                                }
                                setSlidingLeft(true);
                            }}
                            onSwipeLeft={() => {
                                pauseActiveMedia();
                                if (activeSlide === slides.length - 1) {
                                    return;
                                }

                                setSlidingLeft(true);

                            }}
                            onSwipeRight={() => {
                                pauseActiveMedia();
                                if (activeSlide === 0) {
                                    return;
                                }

                                setSlidingRight(true);
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
                                left: width + slideGap,
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
                                    theme={theme}
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
                                left: width + slideGap,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={slidingLeft ? (width + slideGap) * -1 : width + slideGap}
                                onAnimationEnd={() => {
                                    if (slidingLeft) {
                                        setSlidingLeft(false);
                                        setActiveSlide(activeSlide + 1);
                                    }
                                }}
                            >
                                <Slide
                                    theme={theme}
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
                                left: (width + slideGap) * 2,
                                top: 0,
                                background: 'transparent',
                                borderRadius: 15,
                                width,
                                height,
                            }}
                        >
                            <SlideAnimation
                                distance={slidingLeft ? (width + slideGap) * -1 : width + slideGap}
                            >
                                <Slide
                                    theme={theme}
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
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            background: Util.isMobile() ? "black" : "transparent"
                        }}
                    >
                        <div>
                            {
                                slideShow ? <div style={{
                                    marginTop: 10,
                                    width: "100%",
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}>
                                    <PlayPause
                                        width={50}
                                        paused={paused}
                                        onClick={() => {
                                            togglePlayPause();
                                        }}
                                        onPrev={() => {
                                            pauseActiveMedia();
                                            if (activeSlide === 0) {
                                                return;
                                            }
                                            setSlidingRight(true);
                                        }}
                                        onNext={() => {
                                            pauseActiveMedia();
                                            if (activeSlide === slides.length - 1) {
                                                return;
                                            }
                                            setSlidingLeft(true);
                                        }}
                                    />
                                </div> : null
                            }
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
                </div>
            )}
        </Backdrop>,
        () => {
            setActiveSlide(0);
            setOpen(true);
        },
    ];
}
