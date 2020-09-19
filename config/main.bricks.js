const nameEntity = {
    key: 'site_title',
    type: 'single',
    display: {
        name: 'Site title',
        className: 'testName',
    },
    fields: [
        {
            type: 'string',
            required: true,
            display: {
                name: 'Site title',
                description: 'Title in the browser tab',
            },
            validators: {
                uppercase: true,
            },
        },
    ],
};

const phoneEntity = {
    key: 'phone',
    type: 'single',
    display: {
        name: 'Contacts',
    },
    fields: [
        {
            key: 'phone',
            type: 'string',
            required: true,
            display: {
                name: 'Phone number',
                description: 'Displayed in the contact block',
            },
            validators: {
                minlength: [2, 'Phone number tooooo short'],
                maxlength: [32, 'Phone number tooooo long'],
            },
        },
        {
            key: 'email',
            type: 'string',
            required: true,
            display: {
                name: 'Email',
                description: 'Displayed in the contact block',
            },
            validators: {
                custom: [
                    {
                        validator: function (v) {
                            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,12})+$/.test(v);
                        },
                        message: (props) => `${props.value} is not valid email address`,
                    },
                ],
            },
        },
        {
            key: 'plain_phone',
            type: 'string',
            readonly: true,
            display: {
                name: 'Plain phone',
                description: 'For a call from the site - created automatically (not editable)',
                view: ['edit'],
            },
            events: {
                beforeSave: (entity, data) => {
                    return entity['phone'].replace(/[^+\d]+/g, '');
                },
            },
        },
    ],
};

const Folder = {
    key: 'main',
    display: 'Main',
    entities: [nameEntity, phoneEntity],
};

module.exports = Folder;
