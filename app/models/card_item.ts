import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Cart from '#models/cart'
import Product from '#models/product'

export default class CardItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // camelCase properties mapped to snake_case columns
  @column({ columnName: 'cart_id' })
  declare cartId: number

  @column({ columnName: 'product_id' })
  declare productId: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Cart, { foreignKey: 'cartId' })
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>
}