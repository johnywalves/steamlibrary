// Variável com a coleção dos jogos encontrados
var library_all_games = [];

// Apresentar biblioteca no ready do document
function show_library() {
    var deferred = $.Deferred();
    var div_library = $("#library_list");
    div_library.append("<div id='library_list_loading'><img src='img/throbber.gif'/><p>Loading</p></div>");

    get_http("./library.min.json", function (txt) {
        //get_http("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=FFF9ACD14A58B9AA9816E2B8AF72D517&steamid=76561198010203851&include_appinfo=1&include_played_free_games=1&format=json", function (txt) {
        var data = JSON.parse(txt);
        if (data.response && Object.keys(data.response).length > 0) {
            library_all_games = data.response.games;
            library_all_games.sort(function (a, b) { return b.playtime_forever - a.playtime_forever });

            var refresh_games_list = function (filter_name) {
                html_element = "<ul>";
                $.each(library_all_games, function (i, obj) {
                    if (obj.name && (filter_name === undefined || new RegExp(filter_name, "i").test(obj.name))) {
                        if (obj.img_logo_url.length != 0) {
                            var app_html = "<li><a href='https://store.steampowered.com/app/" + obj.appid + "' target=_blank class='library_app'>"

                            app_html += "<div class='flip-container'>";
                            app_html += "<div class='flipper'>";
                            app_html += "<div class='front'><img src='//media.steampowered.com/steamcommunity/public/images/apps/" + obj.appid + "/" + obj.img_logo_url + ".jpg' /></div>";
                            app_html += "<div class='back'>";

                            app_html += "<p class='app'>";
                            app_html += "<strong>" + obj.name + "</strong>";
                            if ((obj.playtime_2weeks != null) || ((obj.playtime_forever != null) && (obj.playtime_forever != 0))) {
                                app_html += "<br/>";
                                if (obj.playtime_2weeks != null) {
                                    app_html += (obj.playtime_2weeks / 60).toFixed(2) + " h in last 2 weeks";
                                }
                                if ((obj.playtime_2weeks != null) && (obj.playtime_forever != null)) {
                                    app_html += "<br/>";
                                }
                                if (obj.playtime_forever != null) {
                                    app_html += (obj.playtime_forever / 60).toFixed(2) + " h in total";
                                }
                            }
                            app_html += "</p>";

                            app_html += "</div></div></div>";
                            app_html += "</a></li>";

                            html_element += app_html;
                        }
                    }

                    if (i === library_all_games.length - 1) {
                        html_element += "</ul>";
                    }
                });

                $("#library_list").html(html_element);
            }

            refresh_games_list();

            $("#library_search").append("<input type='text' id='library_search_input' placeholder='Search'>");
            $("#library_search").show();
            $("#library_search_input").keyup(function (e) {
                if (e.which != 13) {
                    if (!$(this).val())
                        refresh_games_list();
                    else
                        refresh_games_list($(this).val());
                }
            });

            $("#library_list_loading").remove();
            deferred.resolve();
        } else {
            $("#library_list_loading").remove();
            div_library.html("<div id='library_private_profile'>Private Profile</div>");
            deferred.reject();
        }
    });

    return deferred.promise();
}

// Pesquisar biblioteca do Steam
function get_http(url, callback) {
    var http = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    }

    http.open('GET', url, true);
    http.setRequestHeader("Access-Control-Allow-Origin", "https://johnywalves.github.io");
    http.send(null);
}

// Função matemática para resto de divisão
function mod(a, b) {
    return Math.round(a - (Math.floor(a / b) * b));
}