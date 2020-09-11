import { AiOutlineCaretDown } from 'react-icons/ai';
import { FaUserAlt } from 'react-icons/fa';
import Logo from '../UI/Logo';
import React from 'react';
import useAuth from '@client/hooks/auth';

export default function SidebarHeader(): JSX.Element | null {
    const { user } = useAuth();

    return (
        <div className="topSidebar">
            <div className="topSidebar__logo">
                <Logo />
            </div>
            <div className="topSidebar__user">
                <div className="ts__userName">
                    <FaUserAlt />
                    {user?.name}
                </div>
                <div className="ts__userAction">
                    <button className="button --icon">
                        <AiOutlineCaretDown />
                    </button>
                </div>
            </div>
        </div>
    );
}
