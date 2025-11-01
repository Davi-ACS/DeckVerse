import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createGameValidator = vine.compile(
  vine.object({
    name_game: vine.string().minLength(3).maxLength(255),
    rarity_game: vine.string().optional(),
    language_game: vine.string().optional(),
  })
)