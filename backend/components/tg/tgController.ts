const express = require('express')
const router = express.Router()
const tgService = require("./tgService")

router.post('/', async (req, res, next) => {
    try {
        const answer = await tgService.generateLink(req, res);
        return res.status(200).json(answer)
    } catch (error) {
        next(error)
    }
})
router.get('/', async (req, res, next) => {
    try {
        return res.status(200).json({ status: 'ok'})
    } catch (error) {
        next(error)
    }
})

module.exports = router