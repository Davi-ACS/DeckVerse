// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from "@adonisjs/core/http"
import { createSellerValidator, updateSellerValidator } from '#validators/seller'
import { createProductValidator } from '#validators/product'
import { cuid } from '@adonisjs/core/helpers'
import ScryfallService from '#services/ScryfallService'
import ApiManagerService from "#services/ApiManagerService"
import { writeFile } from 'node:fs/promises'
import app from '@adonisjs/core/services/app'

import Seller from '#models/seller'
import Product from '#models/product'
import Card from '#models/card'
import Expansion from "#models/expansion"
import Image from "#models/image"
import Game from "#models/game"

export default class SellersController {

    // Parte de registro e exibição de vendedores
    public async create({ view }: HttpContext) {
        return view.render('pages/user/seller/sellerRegister')
    }
    public async store({ auth, request, response }: HttpContext) {
        console.log('Iniciando criação de vendedor')
        try {
            const data = await request.validateUsing(createSellerValidator)
            const seller = await Seller.create({
                idUser: auth.user!.id,
                name: data.store_name,
                telephone: data.phone,
                address: data.address,
            })
            seller.save()
        } catch (error) {
            console.log(error)
        }

        return response.redirect().toRoute('seller.show')
    }
    public async edit({ auth, view, response }: HttpContext) {
        const user = auth.user!

        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }
        return view.render('pages/user/seller/sellerEdit', { seller })
    }
    public async update({ auth, request, response }: HttpContext) {
        const user = auth.user!

        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }

        // Atualiza os dados do vendedor
        const data = await request.validateUsing(updateSellerValidator)
        seller.merge({
            name: data.store_name || seller.name,
            telephone: data.phone || seller.telephone,
            address: data.address || seller.address,
            description: data.description || seller.description,
        })
        await seller.save()

        return response.redirect().toRoute('seller.show')
    }
    public async show({ auth, response, view }: HttpContext) {
        const user = auth.user!
        try {
            const seller = await Seller.query().where('idUser', user.id).firstOrFail()
            return view.render('pages/user/seller/sellerShow', { seller })
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('seller.create')
        }
    }
    
    // Fim da parte de registro e exibição de vendedores

    // Parte de gerenciamento de produtos do vendedor

    public async myProducts({ auth, view, response, request }: HttpContext) {
        const user = auth.user!

        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }
        const searchQuery = request.input('search')

        // Busca os produtos do vendedor
        let products: Product[]
        try {
            products = await Product.query().where('seller_id', seller.id).preload('card')
            if (searchQuery) {
                products = products.filter(product => 
                    product.card.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            }
            
        } catch (error) {
            products = []
        }
        return view.render('pages/user/seller/product/sellerProducts', { products, searchQuery })
    }

    public async createProduct({ auth, view, response, request }: HttpContext) {
        const user = auth.user!
        const page = request.input('page') ||  1
        const pageSize = 8
        let limit

        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }

        // verifica se o usuario passou um nome de carta para buscar
        const gameName = request.input('gameName')
        const cardName = request.input('cardName') || ''
        console.log('Buscando carta com nome:', cardName)
        let cards = []
        if (cardName) {
            try {
            const apiManagerService = new ApiManagerService()
            const GameId = await Game.query().where('name', gameName).first()
            const data = await apiManagerService.searchCardByName(cardName, GameId?.id || 0)
            cards = data?.data
            limit = Math.ceil(cards.length/pageSize)

            // Paginação manual dos resultados
            const startIndex = (page - 1) * pageSize
            const endIndex = startIndex + pageSize
            cards = cards.slice(startIndex, endIndex)



            } catch (error) {
                console.log(error)
            }
        }
        // Busca os jogos disponíveis
        const games = await Game.all()
        // Pega o jogo selecionado

        return view.render('pages/user/seller/product/sellerCreateProduct', { seller, cards, cardName, games, gameName, page, limit })
    }

    public async showProduct({ auth, view, response, params }: HttpContext) {
        const user = auth.user!
        console.log('Parâmetros recebidos:', params);
        
        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }

        // Busca a carta pelo ID do parametro
        const cardId = params.id
        const gameId = await Game.query().where('name', params.game).first()
        const apiManagerService = new ApiManagerService()
        let cardData
        try {
            const data = await apiManagerService.getCardById(cardId, gameId!.id || 0) // Assuming game ID 2 for Magic, adjust as needed
            cardData = data?.data
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('seller.products.create')
        }

        return view.render('pages/user/seller/product/sellerShowProduct', { seller, card: cardData, gameName: params.game })

    }

    public async storeProduct({ auth, request, response }: HttpContext) {
        const user = auth.user!

        // Verifica se o usuário é um vendedor
        let seller: Seller
        try {
            seller = await Seller.query().where('idUser', user.id).firstOrFail()
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('user.profile')
        }

        // Pega os dados do formulário
        try {
            const payload = await request.validateUsing(createProductValidator)

            // Verifica se a expansão da carta já existe no banco de dados, se não, cria uma nova
            const idGame = await Game.query().where('name', payload.gameName).first()
            let expansion = await Expansion.query().where('name', payload.cardSetName).first()
            if (!expansion) {
                expansion = await Expansion.create({ name: payload.cardSetName, gameId: idGame?.id || 0})
                await expansion.save()
            }
            
            // Verifica se a carta já existe no banco de dados, se não, cria uma nova
            let card = await Card.query().where('collectionCode', payload.cardId).first()
            if (!card) {
                card = await Card.create({
                    name: payload.cardName,
                    description: payload.cardOracleText,
                    rarity: payload.cardRarity,
                    expansionId: expansion.id,
                    collectionCode: payload.cardId,
                })

                // Salva a imagem da carta
                const imageUrl = payload.image_URL
                const response = await fetch(imageUrl)
                const arrayBuffer = await response.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // Gera um nome único para o arquivo
                const fileName = `${cuid()}.png`
                // Define o caminho completo do arquivo
                const filePath = app.makePath(`tmp/uploads/${fileName}`)

                // Salva o arquivo no sistema de arquivos
                await writeFile(filePath, buffer)

                // Cria o registro da imagem
                const image = new Image()
                image.name = fileName
                image.cardId = card.id
                await image.save()

                await card.save()
            }
            // Cria o produto associado à carta e ao vendedor
            const product =  await Product.create({
                sellerId: seller.id,
                cardId: card.id,
                price: payload.price,
                quantity: payload.stockQuantity,
                description: payload.description,
                condition: payload.quality as 'Quase-Perfeita' | 'Pouca-Usada' | 'Muito-Usada' | 'Danificada',
            })

            await product.save()

            console.log('Produto criado com sucesso:', product.id)
            return response.redirect().toRoute('seller.products')
        } catch (error) {
            console.log(error)
            return response.redirect().toRoute('seller.products.create')
        }
    }
  // Fim da parte de gerenciamento de produtos do vendedor

}