import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Seller from '#models/seller'
import Card from '#models/card'
import CardItem from '#models/card_item'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sellerId: number

  @column()
  declare cardId: number

  @column()
  declare quantity: number

  @column()
  declare condition: 'Quase-Perfeita' | 'Pouca-Usada' | 'Muito-Usada' | 'Danificada'
  
  @column()
  declare price: number

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Seller)
  declare seller: BelongsTo<typeof Seller>

  @belongsTo(() => Card)
  declare card: BelongsTo<typeof Card>

  @hasMany(() => CardItem)
  declare cardItems: HasMany<typeof CardItem>
}