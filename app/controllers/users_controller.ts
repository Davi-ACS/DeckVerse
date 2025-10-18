// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"

export default class UsersController {

    async login({ request }: HttpContext) {
        const email = request.input('email')
        const password = request.input('password')

        console.log(`Email: ${email}, Password: ${password}`)
    }

    async register({ request }: HttpContext) {
        const fullName = request.input('username')
        const email = request.input('email')
        const password = request.input('password')

        console.log(`Full Name: ${fullName}, Email: ${email}, Password: ${password}`)
    }
}