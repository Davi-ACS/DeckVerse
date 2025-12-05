import { BaseSeeder } from '@adonisjs/lucid/seeders'

import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
  const user = await User.create({
                    fullName: "Admin",
                    birthDate: "1990-01-01",
                    email: "admin@a.com",
                    password: "123456",
                    role: "admin",
                })
    await user.save()
  }
}