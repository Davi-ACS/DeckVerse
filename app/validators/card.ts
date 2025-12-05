import vine from '@vinejs/vine'

export const createCardValidator = vine.compile(
    vine.object({
        name_card: vine.string().minLength(2).maxLength(100),
        description_card: vine.string(),
        rarity_card: vine.string(),
        language_card: vine.string(),
        collectionCode: vine.string().minLength(2).maxLength(10),
        id_expansion: vine.number().min(1),
        image_card: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        }),
    })
)

export const updateCardValidator = vine.compile(
    vine.object({
        name_card: vine.string().minLength(2).maxLength(100),
        description_card: vine.string(),
        rarity_card: vine.string(),
        language_card: vine.string(),
        collectionCode: vine.string().minLength(2).maxLength(10),
        image_card: vine.file({
            size: '2mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        }).optional(),
    })
)
