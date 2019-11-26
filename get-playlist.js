const request = require('request')

const baseUrl = "https://api.soundcloud.com/users/"
const client_id = "?client_id=iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX&linked_partitioning=1&page_size=500"

const getPlaylist = (userId, mine, their, callback) => {
	const firstReqUrl = baseUrl + userId + '/' + mine + client_id
	request({url: firstReqUrl, json: true}, (err, response) => {
		if (err) { console.log('no response from SC') }
		if (mine == 'favorites'){
			var userList = [...new Set(response.body.collection.map(song => song.user_id))]
		} else {
			var userList = response.body.collection.map(artist => artist.id)
		}
		console.log('first request complete: starting getEachUser')
		getEachUser(userList, their, callback)
	})
}

const getEachUser = (userList, their, callback) => {
	const handle = their == 'favorites' ? 'favorites' : 'tracks'
	var songList = []
	//console.log(userList.length)

	for (var i = 0; i < userList.length; i++) {
		var url = baseUrl + userList[i] + '/' + handle + client_id
		request({url, json: true}, (err, response) => {
			if (err || !response.body){ 
				console.log('request failed for user ' + userList[i])
			}else{
				//console.log('got ' + response.body.collection.length + ' songs')
				var trackList = response.body.collection
				if (trackList){
					console.log('got ' + trackList.length + ' songs')
					songList.push(their == 'toptrack' ? 
						getTopTrack(trackList) : trackList[0])
				}else {
					console.log('song error')
				}
			}
			//console.log(songList.length)
			if (songList.length == userList.length){
				console.log('got full list')
				callback(songList.filter(x => x != undefined))
			}

		})
	}
}

const getTopTrack = (trackList) => {
	var mostLikes = 0
	var topTrack = null
	//console.log(trackList[0].favoritings_count)
	for (var track of trackList){
		//console.log(track.likes_count)
		if (track.favoritings_count > mostLikes){
			mostLikes = track.favoritings_count
			topTrack = track
		}
	}
	return topTrack
}


module.exports = getPlaylist