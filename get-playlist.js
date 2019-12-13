const request = require('request')

const baseUrl = "https://api.soundcloud.com/users/"
const client_id = "?client_id=iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX&linked_partitioning=1&page_size=50"

const getPlaylist = (userId, mine, their, callback) => {
	const firstReqUrl = baseUrl + userId + '/' + mine + client_id
	
	// Get all (liked artists, followings, followers) from user
	request({url: firstReqUrl, json: true}, (err, response) => {
		if (err) { console.log('no response from SC') }
		if (mine == 'favorites'){
			// Make list of user id's from favorites (removing duplicates)
			var userList = [...new Set(response.body.collection.map(song => song.user_id))]
		} else {
			// Map list of artist objects to their user id
			var userList = response.body.collection.map(artist => artist.id)
		}
		console.log('first request complete: starting getEachUser')
		// Make API call for each user in list
		getEachUser(userList, their, callback)
	})
}

const getEachUser = (userList, their, callback) => {
	const handle = their == 'favorites' ? 'favorites' : 'tracks'
	var songList = []

	for (var i = 0; i < userList.length; i++) {
		var url = baseUrl + userList[i] + '/' + handle + client_id
		request({url, json: true}, (err, response) => {
			if (err || !response.body){ 
				console.log('request failed for user ' + userList[i])
			} else {
				var trackList = response.body.collection
				if (trackList){
					console.log('got ' + trackList.length + ' songs')
					// Add their most liked or most recent track to songlist
					songList.push(their == 'toptrack' ? 
						getTopTrack(trackList) : trackList[0])
				}else {
					console.log('song error')
				}
			}
			// See if data has been recieved from last call and send data
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
	for (var track of trackList){
		if (track.favoritings_count > mostLikes){
			mostLikes = track.favoritings_count
			topTrack = track
		}
	}
	return topTrack
}


module.exports = getPlaylist