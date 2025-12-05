import vine from '@vinejs/vine'

export const createSellerValidator = vine.compile(
    vine.object({
        store_name: vine.string().minLength(3).maxLength(100).unique({ table: 'sellers', column: 'name' }),
        phone: vine.string().minLength(10).maxLength(11).regex(/^\d+$/),
        address: vine.string().minLength(15).maxLength(200),
        description: vine.string().minLength(10).maxLength(500).optional(),
    })
)

export const updateSellerValidator = vine.compile(
    vine.object({
        store_name: vine.string().minLength(3).maxLength(100).optional(),
        phone: vine.string().minLength(10).maxLength(11).regex(/^\d+$/).optional(),
        address: vine.string().minLength(15).maxLength(200).optional(),
        description: vine.string().minLength(10).maxLength(500).optional(),
    })
)