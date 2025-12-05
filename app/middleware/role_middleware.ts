import type { HttpContext } from '@adonisjs/core/http'

export default class RoleMiddleware {
 
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, allowedRoles: string[]) {
    await auth.check()

    const userRole = auth.user!.role

    if (!allowedRoles.includes(userRole)) {
      return response.redirect().toRoute('home')
      
    }

    await next()
  }
}