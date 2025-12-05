import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createExpansionValidator = vine.compile(
  vine.object({
    name_expansion: vine.string().minLength(3).maxLength(255),
    game_name: vine.string().minLength(3).maxLength(255),
  })
)