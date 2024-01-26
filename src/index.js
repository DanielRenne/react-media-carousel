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
    const showNextButton = props.showNextButton ? props.showNextButton : false;
    const nextButtonText = props.nextButtonText ? props.nextButtonText : undefined;
    const nextButton = props.nextButton ? props.nextButton : undefined;
    const swipeThreshold = props.swipeThreshold ? props.swipeThreshold : undefined;
    const fontFamily = props.fontFamily ? props.fontFamily : undefined;
    const fontSize = props.fontSize ? props.fontSize : undefined;
    const fontWeight = props.fontWeight ? props.fontWeight : undefined;
    const opacity = props.opacity ? props.opacity : undefined;
    const desktopSlideWidth = props.desktopSlideWidth ? props.desktopSlideWidth : undefined;
    const desktopSlideHeight = props.desktopSlideHeight ? props.desktopSlideHeight : undefined;
    const title = props.title ? props.title : null;
    const showClose = props.showClose !== undefined ? props.showClose : undefined;
    const customAudioPlayer = props.customAudioPlayer ? props.customAudioPlayer : undefined;

    const activeVideoPlayer = useRef();
    const activeAudioPlayer = useRef();
    const activeSlideshowTimer = useRef();



    var adjustedSlides = [];
    if (props.slides && props.slides.length > 0) {
        for (var i = 0; i < props.slides.length; i++) {
            adjustedSlides.push(Util.convertObjectKeysToLowerCase(props.slides[i]));
        }
    }

    const slides = props.slides ? adjustedSlides : [];
    const slideGap = Util.isMobile() ? 10 : 60;
    const width = Util.isMobile() ? window.innerWidth - 40 : desktopSlideWidth ? desktopSlideWidth : 5 * (window.innerWidth / 9);
    const height = Util.isMobile() ? window.innerHeight - 200 : desktopSlideHeight ? desktopSlideHeight : 5 * (window.innerHeight / 8);

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
        if (open) {
            document.addEventListener('keydown', onKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown, open]);

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
            sx={{ color: '#fff', zIndex: 9999, backgroundColor: opacity ? "rgba(0, 0, 0, " + opacity + ")" : "" }}
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
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
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
                                    showNextButton={showNextButton}
                                    nextButtonText={nextButtonText}
                                    nextButton={nextButton}
                                    story={slides[activeSlide - 1].story}
                                    title={slides[activeSlide - 1].title}
                                    src={slides[activeSlide - 1].src}
                                    mediaType={slides[activeSlide - 1].mediaType}
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
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
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
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
                                    left: width - 120,
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
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
                                />
                            </div>
                        </SlideAnimation>
                    ) : null}

                    {/* The Active Slide */}
                    {slidingLeft || slidingRight ? (
                        <div style={{ width, height }} />
                    ) : (
                        <Slide
                            customAudioPlayer={customAudioPlayer}
                            showClose={showClose}
                            editing={editing}
                            theme={theme}
                            width={width}
                            height={height}
                            nextButton={nextButton}
                            fontFamily={fontFamily}
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            showNextButton={activeSlide === slides.length - 1 ? false : showNextButton}
                            nextButtonText={nextButtonText}
                            swipeThreshold={swipeThreshold}
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
                                activeAudioPlayer.current = undefined;
                            }}
                            setActiveAudioPlayer={(component) => {
                                activeAudioPlayer.current = component;
                                activeVideoPlayer.current = undefined;
                            }}
                            audioSrc={slides[activeSlide].audioSrc}
                            onClose={() => {
                                close();
                            }}

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
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
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
                                    left: 50,
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
                                    nextButton={nextButton}
                                    showNextButton={(activeSlide + 1) === slides.length - 1 ? false : showNextButton}
                                    nextButtonText={nextButtonText}
                                    story={slides[activeSlide + 1].story}
                                    title={slides[activeSlide + 1].title}
                                    src={slides[activeSlide + 1].src}
                                    mediaType={slides[activeSlide + 1].mediaType}
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
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
                                    fontFamily={fontFamily}
                                    fontSize={fontSize}
                                    fontWeight={fontWeight}
                                />
                            </SlideAnimation>
                        </div>
                    ) : null}

                    <div
                        style={{
                            position: 'absolute',
                            top: -50,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            background: "transparent"
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: height + 10,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            background: "transparent"
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
