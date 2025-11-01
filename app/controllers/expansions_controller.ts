// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http";
import {createExpansionValidator} from "#validators/expansion";
import Expansion from "#models/expansion";
import Game from "#models/game";

export default class ExpansionsController {
    public async create({ view } : HttpContext) {
        const games = await Game.all()
        return view.render('pages/cards/expansion/createExpansion', { games })
    }
    public async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createExpansionValidator)
            const expansion = await Expansion.create({
                name: payload.name_expansion,
                releaseDate: payload.release_year + '-' + payload.release_month + '-' + payload.release_day,
                gameId: payload.game_id,
            })
            console.log('Expansion created successfully:', expansion)
            expansion.save()
        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }

        return response.redirect().toRoute('expansion.view')
    }

    public async edit({ params, view }: HttpContext) {
        const expansion = await Expansion.findOrFail(params.id)
        const games = await Game.all()
        return view.render('pages/cards/expansion/createExpansion', { expansion, games })
    }

    public async update({ params, request, response }: HttpContext) {
        try {
            const expansion = await Expansion.findOrFail(params.id)
            const payload = await request.validateUsing(createExpansionValidator)
            expansion.name = payload.name_expansion
            expansion.releaseDate = payload.release_year + '-' + payload.release_month + '-' + payload.release_day
            expansion.gameId = payload.game_id
            await expansion.save()
        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }

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