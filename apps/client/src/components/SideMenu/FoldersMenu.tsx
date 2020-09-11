import * as API from '../../utils/API';

import { Menu, MenuItem } from '../UI/Menu';
import React, { useEffect, useState } from 'react';
import useAJAX, { RequestStatus } from '@client/hooks/ajax';

import { IFolder } from '@libs/types/IBricksDocument';
import { Link } from 'react-router-dom';

export default function FoldersMenu(): JSX.Element | null {
    const [folders, setFolders] = useState<IFolder[]>([]);
    const { result, send } = useAJAX<IFolder[]>();

    useEffect(() => {
        send(API.GET('/folders'));
    }, [send]);

    useEffect(() => {
        if (result.status === RequestStatus.SUCCESS) {
            setFolders(result.response!);
        }
    }, [result.status, result.response]);

    const renderFolder = (folder: IFolder) => {
        const entities = folder.entities.map((entity) => {
            return (
                <MenuItem key={entity.key}>
                    <Link to={`/entity/key/${entity.key}`}>{entity.displayName}</Link>
                </MenuItem>
            );
        });

        const childFoldres = folder.children.map((folder) => {
            return renderFolder(folder);
        });

        return (
            <div className="nav__folder" key={folder.key}>
                <h6 className="nav__header">{folder.displayName}</h6>

                <Menu>{entities}</Menu>
                <Menu>{childFoldres}</Menu>
            </div>
        );
    };

    const renderCode = folders.map((folder) => {
        return renderFolder(folder);
    });

    return <nav className="nav">{renderCode}</nav>;
}
