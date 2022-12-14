const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password} = req.body
        const role = (req.body.role) ? req.body.role : 'USER' // Опасно принимать роль ADMIN
        if (!email || !password) {
            return next(ApiError.badRequest('Некоректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const token = generateJwt(user.id, email, user.role)
        return res.json(token)
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json(token)
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        console.log(token)
        return res.json(token)
    }

    async getAll(req, res) {
        let page = (req.query?.page) ? req.query?.page : 1
        let limit = (req.query?.limit) ? req.query?.limit : 7
        let offset = (page - 1) * limit

        const users = await User.findAndCountAll({
            limit, 
            offset,
            attributes: {
                exclude: ['password']
            }
        })
        
        return res.json(users)
    }
}

module.exports = new UserController()


