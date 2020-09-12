import React from 'react';

type LogoProps = {
    className?: string;
    hideText?: boolean;
};

export default function Logo(props: LogoProps): JSX.Element {
    const height = props.hideText ? '104' : '144';
    return (
        <svg
            width="193px"
            height={`${height}px`}
            viewBox={`0 0 193 ${height}`}
            className={props.className}
        >
            <g>
                <rect fill="#EC5CFC" x="49" y="0" width="92" height="41"></rect>
                <rect fill="#5D9AFF" x="101" y="48" width="92" height="41"></rect>
                <rect fill="#FF9251" x="3" y="48" width="92" height="41"></rect>
                {!props.hideText && (
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
                )}
            </g>
        </svg>
    );
}
