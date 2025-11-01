import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createExpansionValidator = vine.compile(
  vine.object({
    name_expansion: vine.string().minLength(3).maxLength(255),
    release_day: vine.number().min(1).max(31),
    release_month: vine.number().min(1).max(12),
    release_year: vine.number().min(1900).max(2100),
    game_id: vine.number().positive(),
  })
)