import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Game from '#models/game'
import card from '#models/card'

export default class Expansion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gameId: number
  
  @column()
  declare name: string

  @column()
  declare releaseDate: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  @hasMany(() => card)
  declare cards: HasMany<typeof card>
}