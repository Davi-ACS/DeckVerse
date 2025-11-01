import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('description', 255).notNullable()
      table.string('rarity').notNullable()
      table.string('language').notNullable()
      table.string('collection_code').notNullable()
      table.integer('expansion_id').unsigned().references('id').inTable('expansions').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}