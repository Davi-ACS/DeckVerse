import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import Product from '#models/product'

export default class Seller extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUser: number
  
  @column()
  declare name: string

  @column()
  declare telephone: string
  
  @column()
  declare address: string

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}