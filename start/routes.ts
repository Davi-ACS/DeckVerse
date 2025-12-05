/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/client_controller')
const SellersController = () => import('#controllers/sellers_controller')

const GamesController = () => import('#controllers/games_controller')
const ExpansionsController = () => import('#controllers/expansions_controller')
const CardsController = () => import('#controllers/cards_controller')

const ImagesController = () => import('#controllers/images_controller')
const ProductsController = () => import('#controllers/products_controller')
const CartsController = () => import('#controllers/carts_controller')

// Página inicial
router.group(() => {
    router.get('/', [ProductsController, 'show']).as('home')
    router.get('/:game', [ProductsController, 'viewExpansionProducts']).as('home.viewFiltered')
})

// Páginas para autenticação
router.group(() => {
    //Login
    router.get('/login', [AuthController, 'show']).as('user.login'),
    router.post('/login', [AuthController, 'handle']).as('user.authenticate'),
    //Logout
    router.get('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth()),
    //Register
    router.get('/register', [AuthController, 'create']).as('user.register'),
    router.post('/register', [AuthController, 'store']).as('user.create')
})

// Página de perfil do Cliente
router.group(() => {
    // parte de perfil do cliente
    router.get('/profile', [ProfilesController, 'show']).as('user.profile')
    router.get('/profile/edit', [ProfilesController, 'edit']).as('user.profile.edit')
    router.post('/profile/edit', [ProfilesController, 'update']).as('user.profile.update')

    // parte da compra do cliente
    router.get('/profile/purchase/:id', [ProductsController, 'showPurchase']).as('user.purchases')
    router.get('/cart', [CartsController, 'show']).as('cart.show')
    router.get('/cart/add/:product/:quantity', [CartsController, 'add']).as('cart.add')
    router.get('/cart/remove/:id', [CartsController, 'remove']).as('cart.remove')

}).use(middleware.auth())

// Páginas para vendedores
router.group(() => {
    // parte de registro de vendedor
    router.get('/seller/register', [SellersController, 'create']).as('seller.create')
    router.post('/seller/register', [SellersController, 'store']).as('seller.store')
    router.get('/seller/edit', [SellersController, 'edit']).as('seller.edit')
    router.post('/seller/edit', [SellersController, 'update']).as('seller.update')

    // parte de perfil de vendedor
    router.get('/seller', [SellersController, 'show']).as('seller.show')

    // parte de produtos do vendedor
    router.get('/seller/products', [SellersController, 'myProducts']).as('seller.products')
    router.get('/seller/products/create/', [SellersController, 'createProduct']).as('seller.products.create')
    router.get('/seller/products/details/:game/:id', [SellersController, 'showProduct']).as('seller.products.show')
    router.post('/seller/products/create', [SellersController, 'storeProduct']).as('seller.products.store')
}).use(middleware.auth())

// Páginas para jogos
router.group(() => {
    router.get('/game/create', [GamesController, 'create']).as('game.create')
    router.post('/game/create', [GamesController, 'store']).as('game.store')
    router.get('/game/view', [GamesController, 'view']).as('game.view')
    router.get('/game/edit/:id', [GamesController, 'edit']).as('game.edit')
    router.post('/game/edit/:id', [GamesController, 'update']).as('game.update')
    router.get('/game/destroy/:id', [GamesController, 'destroy']).as('game.destroy')
}).use(middleware.auth()).use(middleware.role(['admin']))   

// Páginas para expansões
router.group(() => {
    router.get('/expansion/create', [ExpansionsController, 'create']).as('expansion.create')
    router.post('/expansion/create', [ExpansionsController, 'store']).as('expansion.store')
    router.get('/expansion/view', [ExpansionsController, 'view']).as('expansion.view')
    router.get('/expansion/view/:game', [ExpansionsController, 'viewFiltered']).as('expansion.viewFiltered')
    router.get('/expansion/edit/:id', [ExpansionsController, 'edit']).as('expansion.edit')
    router.post('/expansion/edit/:id', [ExpansionsController, 'update']).as('expansion.update')
    router.get('/expansion/destroy/:id', [ExpansionsController, 'destroy']).as('expansion.destroy')
}).use(middleware.auth()).use(middleware.role(['admin']))

// Páginas para cartas
router.group(() => {
    router.get('/card/create/:id', [CardsController, 'create']).as('card.create')
    router.post('/card/create', [CardsController, 'store']).as('card.store')
    router.get('/card/view/all/:id', [CardsController, 'view']).as('card.viewAll')
    router.get('/card/view/details/:id', [CardsController, 'viewSingle']).as('card.viewSingle')
    router.get('/card/edit/:id', [CardsController, 'edit']).as('card.edit')
    router.post('/card/edit/:id', [CardsController, 'update']).as('card.update')
    router.get('/card/destroy/:id', [CardsController, 'destroy']).as('card.destroy')
}).use(middleware.auth()).use(middleware.role(['admin']))

// pagina para imagens
router.get('/images/:name', [ImagesController, 'show']).as('images.show')
