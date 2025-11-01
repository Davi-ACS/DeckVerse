// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"
import {createCardValidator, updateCardValidator} from "#validators/card"
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'


import Expansion from "#models/expansion"
import Card from "#models/card"
import Image from "#models/image"


export default class CardsController {

    public async create({params, view } : HttpContext) {
    try {    
        const expansion = await (await Expansion.findByOrFail('id', params.id))
        await expansion.load('game')
        const rarities = expansion.game.rarity.split(" ")
        const languages = expansion.game.language.split(" ")
        return view.render('pages/cards/card/createCard', { expansion: expansion, rarities: rarities, languages: languages })

    } catch (error) {
        console.error(error)
        return view.render('pages/errors/500')
        }
    }

    public async store({ request, response } : HttpContext) {
        try {
            const data = await request.validateUsing(createCardValidator)
            const card = await Card.create({
                name: data.name_card,
                expansionId: data.id_expansion,
                description: data.description_card,
                rarity: data.rarity_card,
                language: data.language_card,
                collectionCode: data.collectionCode
            })
            const image = new Image()
            image.name = `${cuid()}.${data.image_card.extname}`
            image.cardId = card.id

                await data.image_card.move(app.makePath('tmp/uploads'), {
                    name: image.name,
                })
            await image.save()

            console.log('Card created successfully')

            return response.redirect().toRoute('card.viewSingle', { id: card.id })
        } catch (error) {
            console.error(error)
            return response.redirect().back()
        }
    }

    public async view({ params, view } : HttpContext) {
        try {
            const expansion = await Expansion.findByOrFail('id', params.id)
            const cards = await expansion.related('cards').query().preload('image')
            const game = await expansion.related('game').query().first()
            return view.render('pages/cards/card/viewCard', { cards: cards, expansion: expansion, game: game })
        }
        catch (error) {
            console.error(error)
            return view.render('pages/errors/500')
        }
    }

    public async viewSingle({ params, view } : HttpContext) {
        try {
            const card = await Card.findByOrFail('id', params.id)
            await card.load('image')
            await card.load('expansion')
            await card.expansion.load('game')
            return view.render('pages/cards/card/viewDetailsCard', { card: card })
        }
        catch (error) {
            console.error(error)
            return view.render('pages/errors/500')
        }
    }

    public async edit({ params, view } : HttpContext) {
        try {
            const card = await Card.findByOrFail('id', params.id)
            await card.load('expansion')
            await card.expansion.load('game')
            await card.load('image')
            const rarities = card.expansion.game.rarity.split(" ")
            const languages = card.expansion.game.language.split(" ")
            return view.render('pages/cards/card/createCard', { card: card, rarities: rarities, languages: languages })
        }
        catch (error) {
            console.error(error)
            return view.render('pages/errors/500')
        }
    }

    public async update({ params, request, response } : HttpContext) {
        try {
            const data = await request.validateUsing(updateCardValidator)
            const card = await Card.findByOrFail('id', params.id)

            card.name = data.name_card
            card.description = data.description_card
            card.rarity = data.rarity_card
            card.language = data.language_card
            card.collectionCode = data.collectionCode

            if (data.image_card) {
                let image = await card.related('image').query().first()
                if (!image) {
                    image = new Image()
                    image.cardId = card.id
                }
                image.name = `${cuid()}.${data.image_card.extname}`

                await data.image_card.move(app.makePath('tmp/uploads'), {
                    name: image.name,
                })
                await image.save()
            }

            await card.save()

            console.log('Card updated successfully')
            
            return response.redirect().toRoute('card.viewSingle', { id: card.id })
        } catch (error) {
            console.error(error)
            return response.redirect().back()
        }
    }

    public async destroy({ params, response } : HttpContext) {
        try {
            const card = await Card.findByOrFail('id', params.id)
            const expansionId = card.expansionId
            await card.delete()
            console.log('Card deleted successfully')
            return response.redirect().toRoute('card.viewAll', { id: expansionId })
        } catch (error) {
            console.error(error)
            return response.redirect().back()
        }
    }

}