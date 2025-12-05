import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

import Card from '#models/card'
import Product from '#models/product'
import Cart from '#models/cart'
import CardItem from '#models/card_item'

export default class CartsController {

    public async add({auth,  params, response }: HttpContext) {
        const user = auth.user!
            // pego os parametros
            const productId = params.product
            const quantity = parseInt(params.quantity)

            // verifico se o produto existe
            const product = await Product.findOrFail(productId)

            // pego o carrinho do usuario ou crio um novo
            let cart: Cart
            try {
                cart = await Cart.query().where('user_id', user.id).firstOrFail()
            } catch {
                cart = await Cart.create({
                    user_id: user.id
                })
                await cart.save()
            }

            // verifico se o item ja existe no carrinho
            let cardItem: CardItem
            try {
                cardItem = await CardItem.query().where('cart_id', cart.id).andWhere('product_id', productId).firstOrFail()
                // se existir, atualizo a quantidade
                if (cardItem.quantity + quantity <= 0) {
                    await cardItem.delete()
                    return response.redirect().toRoute('cart.show')
                }
                // verifica o estoque da oferta
                else if (cardItem.quantity + quantity >= product.quantity) {
                    cardItem.quantity = product.quantity
                    await cardItem.save()
                    return response.redirect().toRoute('cart.show')
                }

                else if (cardItem.quantity + quantity > 10) {
                    cardItem.quantity = 10
                    await cardItem.save()
                    return response.redirect().toRoute('cart.show')
                }
                    cardItem.quantity += quantity
                await cardItem.save()
                console.log(cardItem)
            } catch {
                // se nao existir, crio um novo item no carrinho
                cardItem = await CardItem.create({
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity
                })
                await cardItem.save()
                console.log(cardItem)
            }

        return response.redirect().toRoute('cart.show')
    }

    public async remove({auth, params, response }: HttpContext) {
        const user = auth.user!
        const productId = params.id

        // verifico se o carrinho do usuario existe
        let cart: Cart
        try {
            cart = await Cart.query().where('user_id', user.id).firstOrFail()
        } catch {
            return response.redirect().back()
        }

        // verifico se o item existe no carrinho
        let cardItem: CardItem
        try {
            cardItem = await CardItem.query().where('cart_id', cart.id).andWhere('product_id', productId).firstOrFail()
            await cardItem.delete()
        } catch {
            return response.redirect().back()
        }

        return response.redirect().back()
    }

    public async show({auth, view, response }: HttpContext) {
        const user = auth.user!


        // verifico se o carrinho do usuario existe
        let cart: Cart
        try {
            cart = await Cart.query().where('user_id', user.id).firstOrFail()
        } catch {
            cart = await Cart.create({
                user_id: user.id
            })
            await cart.save()
        }
        // pego os itens do carrinho e os produtos, cartas e relacionados
        const products = await cart.related('cardItems').query().preload('product', (productQuery) => {
            productQuery.preload('card', (cardQuery) => {
                cardQuery.preload('image')
            })
        }) 
        return view.render('pages/user/profile/cart', { cart : products })
    }
}