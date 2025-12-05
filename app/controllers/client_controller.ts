// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from "@adonisjs/core/http"
import {updateUserValidator} from '#validators/user'

import User from '#models/user'

export default class ProfilesController {
    async show({ view, auth }: HttpContext) {
        // verifico se o usuario autenticado é admin
        if (auth.user?.role === 'admin') {
            return view.render('pages/user/profile/profileAdmin')
        }
        return view.render('pages/user/profile/profileUser')
    }

    async edit({ view }: HttpContext) {
        return view.render('pages/user/profile/editProfileUser')
    }

    async update({ auth, request, response, session }: HttpContext) {
            const user = auth.user
            if (!user) {
                session.flash('error', 'Usuário não autenticado')
                return response.redirect().back()
            }
            const payload = await request.validateUsing(updateUserValidator, {
                meta: {
                    refs: { userId: user.id }
                }
            })
            user.merge({
                fullName: payload.full_name,
                email: payload.email,
                birthDate: payload.birth_date,
            })
            if (payload.password) {
                user.password = payload.password
            }
            console.log('Updated user data:', user)
            await user.save()
            // refresh auth so the session reflects the updated user
            await auth.use('web').login(user)

            return response.redirect().toRoute('user.profile')

    }
}