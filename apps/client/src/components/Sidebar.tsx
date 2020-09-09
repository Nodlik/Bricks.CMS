import * as API from '../utils/API';

import React, { useEffect, useState } from 'react';

import { IFolder } from '@libs/types/IBricksDocument';
import { Link } from 'react-router-dom';

function Sidebar(): JSX.Element {
    const [folders, setFolders] = useState<IFolder[]>([]);

    useEffect(() => {
        void (async () => {
            const data: IFolder[] = await API.GET('/folders');

            setFolders(data);
        })();
    }, []);

    const renderFolder = (folder: IFolder) => {
        const entities = folder.entities.map((entity) => {
            return (
                <li key={entity.key}>
                    <Link to={`/entity/key/${entity.key}`}>{entity.displayName}</Link>
                </li>
            );
        });

        const childFoldres = folder.children.map((folder) => {
            return renderFolder(folder);
        });

        return (
            <li key={folder.key}>
                <b>{folder.displayName}</b>

                <ul>{entities}</ul>
                <ul>{childFoldres}</ul>
            </li>
        );
    };

    const renderCode = folders.map((folder) => {
        return renderFolder(folder);
    });

    return <ul>{renderCode}</ul>;
}

export default Sidebar;
