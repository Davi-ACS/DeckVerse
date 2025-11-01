/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')
const GamesController = () => import('#controllers/games_controller')
const ExpansionsController = () => import('#controllers/expansions_controller')
const CardsController = () => import('#controllers/cards_controller')
const ImagesController = () => import('#controllers/images_controller')
//const ProductsController = () => import('#controllers/products_controller')

// Página inicial
router.get('/', async ({ view }) => {
    return view.render('pages/home')
}).as('home')

// Páginas para o usuário
router.group(() => {
    router.get('/login', [UsersController, 'login']).as('login'),
    router.get('/register', [UsersController, 'register']).as('register'),
    router.post('/register', [UsersController, 'createUser']).as('createUser')
})

// Páginas para jogos
router.group(() => {
    router.get('/game/create', [GamesController, 'create']).as('game.create')
    router.post('/game/create', [GamesController, 'store']).as('game.store')
    router.get('/game/view', [GamesController, 'view']).as('game.view')
    router.get('/game/edit/:id', [GamesController, 'edit']).as('game.edit')
    router.post('/game/edit/:id', [GamesController, 'update']).as('game.update')
    router.get('/game/destroy/:id', [GamesController, 'destroy']).as('game.destroy')
})

// Páginas para expansões
router.group(() => {
    router.get('/expansion/create', [ExpansionsController, 'create']).as('expansion.create')
    router.post('/expansion/create', [ExpansionsController, 'store']).as('expansion.store')
    router.get('/expansion/view', [ExpansionsController, 'view']).as('expansion.view')
    router.get('/expansion/view/:game', [ExpansionsController, 'viewFiltered']).as('expansion.viewFiltered')
    router.get('/expansion/edit/:id', [ExpansionsController, 'edit']).as('expansion.edit')
    router.post('/expansion/edit/:id', [ExpansionsController, 'update']).as('expansion.update')
    router.get('/expansion/destroy/:id', [ExpansionsController, 'destroy']).as('expansion.destroy')
})

// Páginas para cartas
router.group(() => {
    router.get('/card/create/:id', [CardsController, 'create']).as('card.create')
    router.post('/card/create', [CardsController, 'store']).as('card.store')
    router.get('/card/view/all/:id', [CardsController, 'view']).as('card.viewAll')
    router.get('/card/view/details/:id', [CardsController, 'viewSingle']).as('card.viewSingle')
    router.get('/card/edit/:id', [CardsController, 'edit']).as('card.edit')
    router.post('/card/edit/:id', [CardsController, 'update']).as('card.update')
    router.get('/card/destroy/:id', [CardsController, 'destroy']).as('card.destroy')
})

// pagina para imagem

router.get('/images/:name', [ImagesController, 'show']).as('images.show')