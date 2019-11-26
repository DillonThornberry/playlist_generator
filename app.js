const express = require('express')
const getPlaylist = require('./get-playlist.js')

const app = express()

app.use(express.static(__dirname))

app.get('/playlist', (req, res) => {
	var userId = req.query.user
	var mine = req.query.mine
	var their = req.query.their
	// res.send(JSON.stringify(getPlaylist(userId, mine, their)))
	getPlaylist(userId, mine, their, result => {
		//console.log(result.length)
		res.send(JSON.stringify(result))
	})
})

app.listen(3001, () => {
	console.log('listening on 3001')
})

