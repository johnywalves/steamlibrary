//
var library_all_games = []

//
function get_http(url, callback) {
	var http = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText)
		}
	}
	http.open('GET', url, true)
	//http.setRequestHeader('Access-Control-Allow-Origin', 'https://api.steampowered.com')	
	http.send(null)
}

//
function mod(a, b) {
	return Math.round(a - (Math.floor(a / b) * b))
}

//
function position_size() {
	$("#library_list").css("margin-left", mod($(document).width(), $(".library_app").width()) / 2)
}

//
function show_library() {
	var deferred = $.Deferred()
	var div_library = $("<div id='library_content'></div>")
	$("#inner").after(div_library)
	div_library.append("<div id='library_list'><div id='library_list_loading'><img src='http://cdn.steamcommunity.com/public/images/login/throbber.gif'/>Loading</div></div>")

	get_http("./library.min.json", function (txt) {
	//get_http("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=77FD4D491702D42246D55FC2931F367A&steamid=76561198010203851&include_appinfo=1&include_played_free_games=1&format=json", function (txt) {
		var data = JSON.parse(txt)
		if (data.response && Object.keys(data.response).length > 0) {
			library_all_games = data.response.games
			library_all_games.sort(function (a, b) { return b.playtime_forever - a.playtime_forever })

			var refresh_games_list = function (filter_name) {
				var filtered_games = []

				$("#library_list").html("<ul>")
				$.each(library_all_games, function (i, obj) {
					if (obj.name && (filter_name === undefined || new RegExp(filter_name, "i").test(obj.name))) {
						if (obj.img_logo_url.length != 0) {
							var app_html = "<li><a href='https://store.steampowered.com/app/" + obj.appid + "' target=_blank class='library_app'>"

							app_html += "<div class='flip-container'>"
							app_html += "<div class='flipper'>"
							app_html += "<div class='front'><img src='http://media.steampowered.com/steamcommunity/public/images/apps/" + obj.appid + "/" + obj.img_logo_url + ".jpg'>&nbsp</div>"
							app_html += "<div class='back'>"

							app_html += "<p><strong>" + obj.name + "</strong>"
							if ((obj.playtime_2weeks != null) || ((obj.playtime_forever != null) && (obj.playtime_forever != 0))) {
								app_html += "<br/>"
								if (obj.playtime_2weeks != null)
									app_html += (obj.playtime_2weeks / 60).toFixed(2) + " h recente"
								if ((obj.playtime_2weeks != null) && (obj.playtime_forever != null))
									app_html += " / "
								if (obj.playtime_forever != null)
									app_html += (obj.playtime_forever / 60).toFixed(2) + " h total"
							}

							app_html += "</div></div></div>"
							$("#library_list").append(app_html + "</p></a></li>")
						}
						filtered_games.push(obj)
					}
				})
			}
			$("#library_list").append("</ul>")

			refresh_games_list()

			$("#library_search").append("<input type='text' id='library_search_input' placeholder='Search'>")
			$("#library_search").show()
			$("#library_search_input").keyup(function (e) {
				if (e.which != 13) {
					if (!$(this).val())
						refresh_games_list()
					else
						refresh_games_list($(this).val())
				}
			})

			$("#library_list_loading").remove()
			deferred.resolve()
		} else {
			$("#library_list_loading").remove()
			div_library.html("<div id='library_private_profile'>" + localized_strings[language].library.private_profile + "</div>")
			deferred.reject()
		}
	})

	return deferred.promise()
}