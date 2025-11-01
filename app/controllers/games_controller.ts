// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"
import {createGameValidator} from '#validators/game'
import Game from '#models/game'

export default class GamesController {

    public async create({ view }: HttpContext) {
        return view.render('pages/cards/game/createGame')
    }
    public async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createGameValidator)
            const game = await Game.create({
                name: payload.name_game,
                rarity: payload.rarity_game,
                language: payload.language_game
            })
            console.log('Game created successfully:', game)
            game.save()
        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }

        return response.redirect().toRoute('game.view')
    }

    public async edit({ params, view }: HttpContext) {
        const game = await Game.findOrFail(params.id)
        return view.render('pages/cards/game/createGame', { game })
    }
    public async update({params, request, response }: HttpContext) {

        const payload = await request.validateUsing(createGameValidator)
        const game = await Game.findOrFail(params.id)
        game.merge({
            name: payload.name_game,
            rarity: payload.rarity_game,
            language: payload.language_game
        })
        await game.save()
        console.log('Game updated successfully:', game)

        return response.redirect().toRoute('game.view')
    }

    public async destroy({ params, response }: HttpContext) {
        const game = await Game.findOrFail(params.id)
        await game.delete()
        console.log('Game deleted successfully:', game)

        return response.redirect().toRoute('game.view')
    }

    public async view({ view }: HttpContext) {
        const games = (await Game.all()).reverse()
        return view.render('pages/cards/game/viewGame', { games })
    }
}