import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('seller_id').unsigned().references('id').inTable('sellers').onDelete('CASCADE').notNullable()
      table.integer('card_id').unsigned().references('id').inTable('cards').onDelete('CASCADE').notNullable()
      table.integer('quantity').unsigned().notNullable()
      table.enum('condition', ['Quase-Perfeita','Pouca-Usada', 'Muito-Usada', 'Danificada' ]).notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.string('description').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}