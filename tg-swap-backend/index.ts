require('dotenv').config();
// express 
import * as express from 'express';
const expressOasGenerator = require('express-oas-generator');
const cors = require('cors')
const errorHandler = require('errorhandler')
const methodOverride = require('method-override')
const app = express()
const ip = require('ip')
const allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Connection', 'keep-alive')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
}
const tgController = require('./components/tg/tgController')

// config 
const HOST = ip.address()
const PORT = 8049

app.use(cors())
app.use(errorHandler())
app.use(methodOverride())
app.use(allowCrossDomain)

app.use(express.urlencoded({
	extended: true
}));

require('./components/tg/tgService')

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
	express.json({
		limit: '30mb',
		extended: true
	})(req, res, next);
})

// ROUTES
app.use('/api/tg', tgController)


app.use(function (err, req, res, next) {
	console.error(err)
	if (!err.statusCode) err.statusCode = 500
	res.status(err.statusCode).send(err.message)
});

expressOasGenerator.handleResponses(app, {});

app.listen(PORT, HOST, () => { console.log('server start', HOST, PORT) })
