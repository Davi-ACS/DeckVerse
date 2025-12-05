// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http";
import {createExpansionValidator} from "#validators/expansion";
import Expansion from "#models/expansion";
import Game from "#models/game";

export default class ExpansionsController {
    public async create({ view } : HttpContext) {
        const games = await Game.all()
        const names = games.map(game => game.name)
        return view.render('pages/cards/expansion/createExpansion', { games, names })
    }
    public async store({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createExpansionValidator)
        const game_id = (await Game.findByOrFail('name', payload.game_name)).id
        const expansion = await Expansion.create({name: payload.name_expansion,gameId: game_id,})
        expansion.save()

        return response.redirect().toRoute('expansion.view')
    }

    public async edit({ params, view }: HttpContext) {
        const expansion = await Expansion.findOrFail(params.id)
        await expansion.load('game')
        const games = await Game.all()
        const names = games.map(game => game.name)
        return view.render('pages/cards/expansion/createExpansion', { expansion, games, names })
    }

    public async update({ params, request, response }: HttpContext) {
        const expansion = await Expansion.findOrFail(params.id)
        const payload = await request.validateUsing(createExpansionValidator)
        const game_id = (await Game.findByOrFail('name', payload.game_name)).id
        expansion.name = payload.name_expansion
        expansion.gameId = game_id
        await expansion.save()

        return response.redirect().toRoute('expansion.view')
    }

    public async view({ view } : HttpContext) {
    const expansions = (await Expansion.query().preload('game'))
        
    return view.render('pages/cards/expansion/viewExpansion', { expansions, game_name: "Todos os jogos" })
    }

    public async viewFiltered({ params, view } : HttpContext) {
        try {
            const idGame = await Game.findByOrFail('name', params.game)
            const expansions = (await Expansion.query().where('game_id', idGame.id).preload('game'))
            return view.render('pages/cards/expansion/viewExpansion', { expansions, game_name: idGame.name })

        } catch (error) {
            console.log(error)
            return view.render('pages/cards/expansion/viewExpansion', { expansions: [], game_name: "Todos os jogos" })
        }
            
    }

    public async destroy({ params, response }: HttpContext) {
        try {
            const expansion = await Expansion.findOrFail(params.id)
            await expansion.delete()
        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }

        return response.redirect().toRoute('expansion.view')
    }
}