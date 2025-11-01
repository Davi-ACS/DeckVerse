// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"
import {createUserValidator} from '#validators/user'

import User from '#models/user'

export default class UsersController {

    async login({ view }: HttpContext) {
        return view.render('pages/login')
    }


    async register({ view }: HttpContext) {
        return view.render('pages/register')
    }

    async createUser({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createUserValidator)
            console.log(payload)

            if (payload.password !== payload.password_confirmation) {
                console.log('Password confirmation does not match')
                return response.redirect().back()
            }

            if (await User.findBy('email', payload.email)) {
                console.log('Email already in use')
                return response.redirect().back()
            }


            // Create the user
            const user = await User.create({
                fullName: payload.full_name,
                birthDate: payload.birth_date,
                email: payload.email,
                password: payload.password,
            })
            console.log('User created successfully:', user)
            user.save()

        } catch (error) {
            console.log(error)
            return response.redirect().back()
        }

        return response.redirect().toRoute('home')
    }
}