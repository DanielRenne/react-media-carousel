import React from "react";

export default function SlideAnimation(props) {
    const dynamicKeyframes = `@keyframes dynamicMoveAnimation {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(${props.distance + "px"});
    }
  }`;

    //Options
    //linear:  Progresses at a constant pace from start to end
    //ease:  Default value. Starts slowly, accelerates in the middle, and slows down at the end.
    //ease-in:  Starts slowly and accelerates towards the end.
    //ease-in-out:  Starts slowly, accelerates in the middle, and slows down at the end
    //ease-out:  Starts quickly and slows down towards the end
    //cubic-bezier(0.42, 0, 0.58, 1):  Allows you to define your own timing function using cubic Bezier curves

    const animationStyle = {
        animation: `dynamicMoveAnimation 500ms ease-in-out forwards`,
    };

    return (
        <div style={{ position: "relative" }}>
            <style>{dynamicKeyframes}</style>
            <div
                style={{
                    position: "absolute",
                    ...animationStyle,
                }}
                onAnimationEnd={() => {
                    if (props.onAnimationEnd) {
                        props.onAnimationEnd();
                    }
                }}
            >
                {props.children}
            </div>
        </div>
    );
}
