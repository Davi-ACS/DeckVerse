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

router.get('/', async ({ view }) => {
    return view.render('pages/home')
})
router.group(() => {
    router.post('/login', [UsersController, 'login']).as('login'),
    router.post('/register', [UsersController, 'register']).as('register')
})

//router.on('/').render('pages/home')
