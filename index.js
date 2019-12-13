const baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'
const endUrl = '&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true'
const makeUrl = (id) => baseUrl + id.toString() + endUrl

var songList = null

// Get song list based on given parameters, set first song to play, and
// make HTML elements for each song 

fetch('/playlist?user=293331713&mine=followings&their=toptrack')
.then(res => res.json()).then(json => {
	songList = json
	changeSong(0)
	makeSongCards(json)
})

const changeSong = index => {
	console.log(index)
	document.getElementById('sc-player').src = makeUrl(songList[index].id)
}

const clickedImg = i => {
	changeSong(i)

}

const makeSongCards = (songList) => {
	const altImage = "http://service-line.co.uk/wp-content/uploads/2016/05/PPM-Services-Icon-100x100.png"

	// For every song in songList, make a div with a button inside of it,
	// the track image inside the button (or alt image), and the track
	// title and artist name below it. Then append them all to 'song-container'

	for (var i = 0; i < songList.length; i++){

		var div = document.createElement('div')
	
		div.className = "song-card`"
		div.innerHTML = `<button class="song" onclick="changeSong(${i})"> 
			<img class="song-img" src=${songList[i].artwork_url} alt=${songList[i].title.split(' ').join('-')} onerror="this.src='${altImage}'"></img> 
		</button>`

		div.innerHTML += `<p class="title">${songList[i].title}</p>`
		div.innerHTML += `<p class="artist"><i>${songList[i].user.username}</i></p>`
	
		document.getElementById('song-container').appendChild(div)
	}
	var pics = document.getElementsByClassName('song-cover')
}