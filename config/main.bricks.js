const nameEntity = {
	key: "site_title",
	type: "single",
	display: {
		name: 'Заголовок сайта',
        className: 'testName',
        style: {
            color: 'red',
        },
	},
	fields: [
		{
			type: "string",
			required: true,
			display: {
				name: 'Заголовок сайта',
				description: 'Отображается в адресной строке'
			}
		}
	]
}

const phoneEntity = {
	key: "phone",
	type: "single",
	display: {
		name: 'Контактный телефон'
	},
	fields: [
		{
			key: "phone",
			type: "string",
			required: true,
			display: {
				name: 'Контактный телефон',
				description: 'Отображается в контактах'
			},
            validators: {
                minlength: [2, 'Name name tooooo short'],
                maxlength: [12, 'Name name tooooo long'],
                custom: [
                    {
                        validator: function (v) {
                            return v === 'test';
                        },
                        message: (props) => `${props.value} is not a VALUEEE! PRINT TESTTTT!`,
                    },
                ],
            },
		},
		{
			key: "formatted_phone",
			type: "string",
			readonly: true,
			display: {
				name: 'Номер без форматирования',
				description: 'Для звонка с сайта - создается автоматичски (не редактируемый)',
				view: ['single']
			},
			events: {
				beforeSave: (entity, data) => {
					return entity['phone'].substring(0, 2);
				}
			}
		},
	]
}

const Folder = {
	key: 'main',
	display: 'Основные настройки',
	entities: [
		nameEntity, phoneEntity
	]
}

module.exports = Folder;