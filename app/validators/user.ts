import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3).maxLength(100),
    email: vine.string().email(),
    birth_date: vine.date().transform((value) => value.toISOString().split('T')[0]),
    password: vine.string().minLength(6).maxLength(30),
    password_confirmation: vine.string().minLength(6).maxLength(30),
  })
)

