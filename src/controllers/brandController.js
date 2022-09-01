const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) {
        try {
            const {many} = req.query
            if (many === 'true') {
                const data = req.body
                const brand = await Brand.bulkCreate(data)
                return res.json(brand)
            } else {
                const {name} = req.body
                const brand = await Brand.create({name})
                return res.json(brand)
            }
        } catch (e) {
            return res.json(e)
        }
    }

    async getAll(req, res) {
        const brand = await Brand.findAll()
        return res.json(brand)
    }
}

module.exports = new BrandController()