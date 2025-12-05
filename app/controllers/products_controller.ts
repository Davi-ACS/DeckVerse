import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

import Product from '#models/product'
import Card from '#models/card'
import Image from '#models/image'

export default class ProductsController {
  public async show({ view }: HttpContext) {
    // Pegando todos as cartas e imagens relacionadas que possuem produto
    const cardsWithProducts = await Card.query()
      .has('products')
      .preload('image')
      .preload('expansion', (q) => q.preload('game'))

    // Agrupa por jogo (expansion.game.name)
    const grouped = new Map()
    for (const card of cardsWithProducts) {
      const gameName = card.expansion && card.expansion.game ? card.expansion.game.name : 'Outros'
      if (!grouped.has(gameName)) grouped.set(gameName, [])
      grouped.get(gameName).push(card)
    }

    const groupedProducts = Array.from(grouped.entries()).map(([gameName, cards]) => ({ gameName, cards }))

    return view.render('pages/home', { products: cardsWithProducts, groupedProducts })
  }

  public async viewExpansionProducts({ params, view, request }: HttpContext) {
    const gameName = params.game

    // Parâmetros de busca e paginação via query string
    const search = (request.input('search') || '').toString()
    const page = Number(request.input('page') || 1)
    const perPage = Number(request.input('perPage') || 12) // default 12 (3 linhas x 4 cols)

    // Pegando todos as cartas e imagens relacionadas que possuem produto e pertencem ao jogo especificado
    const cardsWithProducts = await Card.query()
      .has('products')
      .preload('image')
      .preload('expansion', (q) => q.preload('game'))

    // Filtra cartas que realmente pertencem ao jogo
    let filteredCards = cardsWithProducts.filter(card => card.expansion && card.expansion.game && card.expansion.game.name === gameName)

    // Aplica busca (se houver)
    if (search) {
      const s = search.toLowerCase()
      filteredCards = filteredCards.filter(card => card.name && card.name.toLowerCase().includes(s))
    }

    const total = filteredCards.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))

    // Paginação
    const start = (page - 1) * perPage
    const end = start + perPage
    const pagedCards = filteredCards.slice(start, end)

    const groupedProducts = [{ gameName, cards: pagedCards }]

    return view.render('pages/homeFiltered', { products: pagedCards, groupedProducts, page, perPage, total, totalPages, search })
  }

  public async showPurchase({ params, view }: HttpContext) {
    const cardId = params.id

    // Pegando a carta, imagem e expansão relacionadas e pegandos todas as ofertas(produtos) dela
    const card = await Card.findOrFail(cardId)
    await card.load('image')
    await card.load('expansion')
    const products = await card.related('products').query().preload('seller')

    const product = {
      card: card,
      image: card.image,
      offers: products
    }

    return view.render('pages/products/purchaseShow', { product })
  }
}