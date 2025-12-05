import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Game from '#models/game'

export default class extends BaseSeeder {
  async run() {
    // Cria os tres jogos principais

    const game1 = await Game.create({name: 'Pokemon'})
    const game2 = await Game.create({name: 'Magic'})
    const game3 = await Game.create({name: 'Yu-Gi-Oh!'})

    await game1.save()
    await game2.save()
    await game3.save()
  }
}