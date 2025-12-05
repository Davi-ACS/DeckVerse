import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'

import Expansion from '#models/expansion'
import Image from '#models/image'
import Product from '#models/product'

export default class Card extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare rarity: string

  @column()
  declare collectionCode: string

  @column()
  declare expansionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Expansion)
  declare expansion: BelongsTo<typeof Expansion>

  @hasOne(() => Image)
  declare image: HasOne<typeof Image>

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}