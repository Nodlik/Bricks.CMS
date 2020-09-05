const imageEntity = {
    key: 'image',
    type: 'collection',
    display: {
        name: 'Изображения',
    },
    effect: {
        sortable: 'position',
    },
    fields: [
        {
            key: 'name',
            type: 'string',
            display: {
                name: 'Название изображения',
            },
            required: true,
        },
        {
            key: 'image',
            type: 'image',
            display: {
                name: 'Изображение',
            },
            required: true,
            options: {
                sizes: [
                    [300, 200],
                    [900, 500],
                    [1440, 1000],
                ],
                methods: 'contain', // fill | cover
				position: 'centre',
                saveOriginal: true,
            },
        },
    ],
};

const Folder = {
    key: 'image',
    display: 'Слайдер изображений',
    entities: [imageEntity],
};

module.exports = Folder;
