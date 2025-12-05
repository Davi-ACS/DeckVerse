import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
    vine.object({
        cardId: vine.string(),
        image_URL: vine.string(),
        quality: vine.string(),
        description: vine.string().maxLength(1000),
        price: vine.number().min(0),
        stockQuantity: vine.number().min(0),

        // Campos opcionais para cartas de jogo
        cardName: vine.string(),
        cardOracleText: vine.string(),
        cardRarity: vine.string(),
        cardSetName: vine.string(),
        gameName: vine.string(),
    })
)   
