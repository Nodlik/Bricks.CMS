import React from 'react';

type LogoProps = {
    className?: string;
};

export default function Logo(props: LogoProps): JSX.Element {
    return (
        <svg width="193px" height="144px" viewBox="0 0 193 144" className={props.className}>
            <g>
                <rect fill="#EC5CFC" x="49" y="0" width="92" height="41"></rect>
                <rect fill="#5D9AFF" x="101" y="48" width="92" height="41"></rect>
                <rect fill="#FF9251" x="3" y="48" width="92" height="41"></rect>
                <text
                    fontFamily="AvenirNext-DemiBold, Avenir Next"
                    fontSize="40"
                    fontWeight="500"
                    letterSpacing="0.3"
                    fill="#777777"
                >
                    <tspan x="34.0533336" y="129">
                        .bricks
                    </tspan>
                </text>
            </g>
        </svg>
    );
}
