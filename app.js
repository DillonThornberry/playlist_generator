const express = require('express')
const getPlaylist = require('./get-playlist.js')

const app = express()

app.use(express.static(__dirname))

app.get('/playlist', (req, res) => {
	var { user, mine, their } = req.query

	getPlaylist(user, mine, their, result => {
		res.send(JSON.stringify(result))
	})
})

app.listen(3001, () => {
	console.log('listening on 3001')
})

