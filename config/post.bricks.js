const commentEntity = {
    key: 'comment',
    type: 'collection',
    display: {
        name: 'Комментарии',
        titleField: 'author',
    },
    apiAction: ['fetch', 'create'],
    fields: [
        {
            key: 'author',
            type: 'string',
            display: {
                name: 'Автор',
            },
            required: true,
        },
        {
            key: 'text',
            type: 'html',
            display: {
                name: 'Текст комментария',
                description: 'Описание текста публикации',
                view: ['single'],
            },
            required: true,
        },
    ],
};

const postEntity = {
    key: 'post',
    type: 'collection',
    template: 'temp',
    display: {
        name: 'Публикации',
    },
    effect: {
        sortable: 'position',
    },
    fields: [
        {
            key: 'name',
            type: 'string',
            display: {
                name: 'Название публикации',
                description: 'Описание названия публикации',
			},
            required: true,
            validators: {
                minlength: [2, 'Post name tooooo short'],
                maxlength: [12, 'Post name tooooo long'],
                custom: [
                    {
                        validator: function (v) {
                            return true;
                        },
                        message: (props) => `${props.value} is not a VALUEEE! PRINT TESTTTT!`,
                    },
                ],
            },
            events: {
                beforeSave: (entity, app) => {
                    return entity['name'].toUpperCase();
                },
            },
        },
        {
            key: 'text',
            type: 'html',
            display: {
                name: 'Текст публикации',
                description: 'Описание текста публикации',
                view: ['new', 'edit'],
            },
            required: true,
            validators: {
                minlength: [10, 'Post text tooooo short'],
            },
        },
    ],
    children: [
        {
            key: 'comment',
            display: 'Комментарии',
            entities: [commentEntity],
        },
    ],
};

const Folder = {
    key: 'post',
    display: 'Посты',
    entities: [postEntity],
};

module.exports = Folder;
