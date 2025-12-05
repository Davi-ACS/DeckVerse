// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"
import {createUserValidator} from '#validators/user'

import User from '#models/user'

export default class AuthController {

    async show({ view }: HttpContext) {
        return view.render('pages/user/auth/login')
    }

    async handle({ request, auth, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        const user = await User.verifyCredentials(email, password)

        await auth.use('web').login(user)

        response.redirect().toRoute('home')
    }

    async create({ view }: HttpContext) {
        return view.render('pages/user/auth/register')
    }

    async store({ request, response }: HttpContext) {
            const payload = await request.validateUsing(createUserValidator)

            // Create the user
            const user = await User.create({
                fullName: payload.full_name,
                birthDate: payload.birth_date,
                email: payload.email,
                password: payload.password,
            })
            user.save()

        return response.redirect().toRoute('user.login')
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect().toRoute('home')
    }
}