import React, { useState } from 'react';

import { GiHamburgerMenu } from 'react-icons/gi';
import { IconContext } from 'react-icons/lib';

type SidebarProps = {
    children?: React.ReactNode;
};

export default function Sidebar(props: SidebarProps): JSX.Element {
    const [isOpen, setIsClose] = useState<boolean>(false);

    return (
        <aside className={'sidebar' + (isOpen ? ' --open' : '')}>
            <div
                className="sidebar__overlay"
                onClick={() => {
                    setIsClose(false);
                }}
            ></div>
            <IconContext.Provider value={{ size: '3em' }}>
                <div className="sidebar__icon">
                    <button
                        className="sidebar__button"
                        onClick={() => {
                            setIsClose(!isOpen);
                        }}
                    >
                        <GiHamburgerMenu />
                    </button>
                </div>
            </IconContext.Provider>
            <div className="sidebar__content">{props.children || ''}</div>
        </aside>
    );
}
