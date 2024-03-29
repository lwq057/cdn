//标签兼容性
(function(){
    var html5elmeents = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split('|');
    for(var i = 0; i < html5elmeents.length; i++){
        document.createElement(html5elmeents[i]);
    }
})();

//追加元素
var sponsor_html = '<input id="sponsor" type="checkbox"><dialog class="box sponsor" open><header class="title">赞助任意金额</header><section><p>土嗨DJ网致力于中国DJ电子音乐文化传播发展</p><p>共享大量优秀的DJ音乐在线免费试听下载</p><img src="https://cdn.jsdelivr.net/gh/lwq057/cdn@1.5/dj.k7dj.com/sponsor.png" alt="二维码"><p>感谢有你们的支持 让我们更好的前行</p></section><footer><label for="sponsor">确定</label></footer></dialog>';
var share_html = '<input id="share" type="checkbox"><dialog class="box share" open><header class="title">分享</header><section><noscript>您的浏览器不支持或未启用JavaScript，部分功能无法使用。</noscript></section><footer><label for="share">确定</label> <label for="share">复制</label></footer></dialog>';
var player_html = '<input id="playerlist" type="checkbox"><dialog class="box playerlist" open><ul></ul><footer><label for="playerlist" onclick="clear_playlist()">清空</label><label for="playerlist">收起</label></footer></dialog><div class="players"><div class="btn"><i id="player-mute">静音</i> <i id="player-prev">上曲</i> <i id="player-after">慢速</i> <i id="player-playpause">播放</i> <i id="player-front">快速</i> <i id="player-next">下曲</i> <i id="player-mode">模式</i></div><div class="info"><h2><b id="player-title">土嗨DJ网</b><i id="plarer-state"></i><span><i id="player-current">00:00</i>/<i id="player-duration">00:00</i></span></h2><div class="order"><progress id="player-progress" value="0" max="100"></progress><i id="player-vol">90</i> <input id="player-volume" type="range" min="0" max="100" value="80"></div></div><div class="extra"><label id="player-list" for="playerlist">列表</label> <i id="player-down">下载</i> <label for="share" id="player-share">分享</label> <label for="sponsor">赞助</label></div></div><hr>';
var body_div = document.createElement('div');
body_div.innerHTML = sponsor_html+share_html+player_html;
document.body.appendChild(body_div);

// 播放列表自动滚动当前选中
var playerlist_ul = document.querySelector('dialog.playerlist>ul');
if (playerlist_ul){
    document.getElementById('playerlist').onchange = function(){
        if (this.checked){
            var pl_c;
            if (pl_c = playerlist_ul.querySelector('li.c')){
                playerlist_ul.scrollTop = pl_c.offsetTop;
            }
        }
    };
}

//ajax封装
function ajax(options){
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.async = (options.async == undefined) ? true : options.async;
    var params = formatParams(options.data);
    if(window.XMLHttpRequest){
        var xhr = new XMLHttpRequest();
    }else{
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(options.type=='GET'){
        if (params){
            params = '?'+params;
        }
        xhr.open('GET',options.url+params,options.async);
        xhr.send();
    }else if(options.type=='POST'){
        xhr.open('POST',options.url,options.async);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(params);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            //if(xhr.status>=200 && xhr.status<300 || xhr.status == 304){
                options.success(xhr.responseText);
            //}else{
            //    options.error && options.error(xhr.status);
            //}
        };
    };
    function formatParams(data){
        var arr=[];
        for(var name in data){
            arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
        }
        //arr.push(("v="+Math.random()).replace(".",""));
        return arr.join("&");
    }
}


//数据库音乐读写删除
function idb_music(name,data){
    if (!name){
        return false;
    }
    if ('indexedDB' in window) {
        const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
        var req = indexedDB.open("music", 1);
        req.onupgradeneeded = function(e){
            var db = req.result;
            db.createObjectStore('name');
            db.createObjectStore('url');
        }
        req.onsuccess = function(event){
            var db = event.target.result;
            var transaction = db.transaction([name], 'readwrite');
            var musicStore = transaction.objectStore(name);

            if (data == 'clear'){
                musicStore.clear();
                return true;
            }

            var re = /^[0-9]+$/;
            if (re.test(data)){
                musicStore.delete(data.toString());
                return true;
            }

            if (typeof data == 'object'){
                for(var k in data){
                    musicStore.put( data[k] , k );
                }
            }else{
                musicStore.getAllKeys().onsuccess = function(ke) {
                    var keys = ke.target.result;
                    musicStore.getAll().onsuccess = function(event) {
                        var list = {};
                        var values = event.target.result;
                        for(var k in keys){
                            list[keys[k]] = values[k];
                        }
                        switch (name) {
                            case 'url':
                                players.playlisturl = Object.assign(players.playlisturl,list);
                                break;
                            case 'name':
                                players.playlist = Object.assign(players.playlist,list);
                                play_playlistui();
                                break;
                        }
                    };
                }
            }
        }
    }
    return false;
}

//读取cookie
function getCookie(k){
    var a,r=new RegExp("(^| )"+k+"=([^;]*)(;|$)");
    if(a=document.cookie.match(r)){
		return decodeURIComponent((decodeURI(a[2])).replace(/\+/g," "));
	}
    return '';
}

//写入cookie
function setCookie(k,v,s){
    var e = new Date();
    e.setTime(e.getTime() + s*1000);
    document.cookie = k + "="+ escape (v) + ";expires=" + e.toGMTString();
}

//播放页链接
function playlink(id,name){
    if (!id){
        return '<a href="#/">土嗨DJ网</a>';
    }
    if (name){
        return '<a data-id="'+id+'" href="#/dj-'+id+'">'+name+'</a>';
    }
    return window.location.protocol+"//"+window.location.host+'/dj-'+id;
}

//播放器
var music,play,audio,music_url;
var playlist = {};
var playlisturl = {};
var play_id,radio,radio_url,playlisi,lists,list,title,radios,list_play,list_remove,ids;
var play_cover,play_pause,play_after,play_front,play_prev,play_next,play_down,play_duration,play_current,play_progress,play_volume_range,play_vol,play_mute,play_loop,interval;

//获取对象
var player_ids = 'player_mute,player_prev,player_after,player_playpause,player_front,player_next,player_mode,player_title,player_current,player_duration,player_vol,player_volume,player_list,player_down,player_share,player_progress,plarer_state';
player_ids = player_ids.split(",");
var players = {};
for (i = 0; i < player_ids.length; i++) { 
    players[player_ids[i]] = document.getElementById( player_ids[i].replace('_','-') );
}
players['play_list'] = document.querySelector('.playerlist>ul');
players['playlist'] = {};
players['playlisturl'] = {};
players['playmode'] = 'loop'; //loop顺序 shuffle随机 one单曲
var e_null = document.createElement('div');

// var spectrum = document.getElementById("spectrum");
// var spectrum_ctx = spectrum.getContext("2d");
// var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
// var ac = new AudioContext();
// var width,height,bufferLength,dataArray,analyser,ac_audio;

function player(){
    //if (play = document.getElementsByClassName('play')[0]){

        //频谱初始化
        // width = spectrum.width = window.innerWidth;
        // height = spectrum.height = window.innerHeight;

        //加载播放器
        if (!audio){
            audio = document.createElement('audio');
            audio.preload = true;
            audio.autoplay = true;
            audio.muted = false;
            audio.loop = false;
            audio.volume = getCookie('player_volume') || 0.9;

            // if (!ac_audio){
            //     ac_audio = ac.createMediaElementSource(audio);
            //     analyser = ac.createAnalyser();
            //     ac_audio.connect(analyser);
            //     analyser.connect(ac.destination);
            //     analyser.fftSize = 256;
            //     bufferLength = analyser.frequencyBinCount;
            //     dataArray = new Uint8Array(bufferLength);
            //     spectrum_draw();
            // }

            // var color1 = spectrum_ctx.createLinearGradient(width / 2, height / 2-10, width / 2, height / 2 - 150);
            // var color2 = spectrum_ctx.createLinearGradient(width / 2, height / 2+10, width / 2, height / 2 + 150);
            // color1.addColorStop(0, '#1E90FF');
            // color1.addColorStop(.25, '#FF7F50');
            // color1.addColorStop(.5, '#8A2BE2');
            // color1.addColorStop(.75, '#4169E1');
            // color1.addColorStop(1, '#00FFFF');
            // color2.addColorStop(0, '#1E90FF');
            // color2.addColorStop(.25, '#FFD700');
            // color2.addColorStop(.5, '#8A2BE2');
            // color2.addColorStop(.75, '#4169E1');
            // color2.addColorStop(1, '#FF0000');
        }
        

        //频谱绘制
        // function spectrum_draw(){
        //     drawVisual = requestAnimationFrame(spectrum_draw);
        //     var barHeight;
        //     spectrum_ctx.clearRect(0, 0, width, height);
        //     for (var i = 0; i < bufferLength; i++){
        //         barHeight = dataArray[i];
        //         analyser.getByteFrequencyData(dataArray);
        //         spectrum_ctx.fillStyle = color1; 
        //         spectrum_ctx.fillRect(width / 2 + (i * 8), height / 2, 2, -barHeight);
        //         spectrum_ctx.fillRect(width / 2 - (i * 8), height / 2, 2, -barHeight);
        //         spectrum_ctx.fillStyle = color2; 
        //         spectrum_ctx.fillRect(width / 2 + (i * 8), height / 2, 2, barHeight);
        //         spectrum_ctx.fillRect(width / 2 - (i * 8), height / 2, 2, barHeight);
        //     }
        // };


        //列表界面
        play_playlistui = function (id,ui){

            if (ui || !id){
                var list_html = '';
                for(var k in players.playlist){
                    list_html += '<li data-id="'+k+'"><span onclick="play_playlist('+k+')">'+players.playlist[k]+'</span><i onclick="remove_playlist('+k+')"></i></li>';
                }
                players.play_list.innerHTML = list_html;
                var k = Object.keys(players.playlist);
                if (k.length > 999){
                    players.player_list.innerText = '列表999+';
                }else{
                    players.player_list.innerText = '列表'+(k.length);
                }
            }
            
            if (id){
                document.title = players.playlist[id];
                players.player_title.innerHTML = playlink(id,players.playlist[id]);
                if (players.playlist[audio.id]){
                    var list = players.play_list.querySelectorAll('li');
                    for (var i = 0; i < list.length; i++) {
                        list[i].classList.remove('c');
                    }
                    players.play_list.querySelector('li[data-id="'+audio.id+'"]').classList.add('c');
                }
            }
        }

        //添加播放列表url
        add_playlisturl = function(data){
            players.playlisturl = Object.assign(players.playlisturl,data);
            idb_music('url',data);
        }

        //添加播放列表
        add_playlist = function(data){
            var datas = [];
            var urls = {};
            if (data.id && data.name){
                datas[data.id] = data.name;
                if (data.url){
                    urls[data.id] = data.url;
                    add_playlisturl( urls );
                }
            }else{
                for(var k in data){
                    datas[data[k].id] = data[k].name;
                    if (data[k].url){
                        urls[data[k].id] = data[k].url;
                    }
                }
            }
            players.playlist = Object.assign(players.playlist,datas);
            idb_music('name',datas);
            if (urls.length){
                add_playlisturl( urls );
            }
            play_playlistui(audio.id,true);
        }

        //获取对象
        play = document.getElementsByClassName('play')[0] || e_null;
        play_cover = play.querySelector('.cover') || e_null;
        music = play.querySelector('#music') || e_null;
        play_pause = play.querySelector('.btn-play-pause') || e_null;
        play_after = play.querySelector('#btn-after') || e_null;
        play_front = play.querySelector('#btn-front') || e_null;
        play_prev = play.querySelector('#btn-prev') || e_null;
        play_next = play.querySelector('#btn-next') || e_null;
        play_down = play.querySelector('#btn-down') || e_null;
        play_duration = play.querySelector('#play_duration') || e_null;
        play_current = play.querySelector('#play_current') || e_null;
        play_progress = play.querySelector('progress') || e_null;
        play_volume_range = play.querySelector('input[type="range"]') || e_null;
        play_vol = play.querySelector('#play_vol') || e_null;
        play_mute = play.querySelector('#btn-mute') || e_null;
        play_loop = play.querySelector('#btn-loop') || e_null;

        if (play){
            var playid = play.getAttribute('data-id'); //播放页临时ID
            if (!playid && playlisi != undefined){
                playid = playlist[playlisi].id;
            }
            music_url = '';
            //播放ID不一样
            if ( (!audio.id) || (playid && audio.id != playid) ){
                music_url = getCookie('music'+playid);
                setCookie('music'+playid,null,-1);
                if (!music_url){
                    music_url = play.getAttribute('data-data');
                    if (music_url){
                        music_url = decodeURIComponent(window.atob(decodeURIComponent(music_url)));
                    }
                }

                int_play = function (){
                    music.src = music_url;
                    if (music_url && document.getElementById('play-title')){
                        add_playlist( {'id':playid,'name':document.getElementById('play-title').innerText,'url':music_url} );
                    }
                    audio.autoplay = false;
                }

                if (!music_url && players.playlisturl[playid]){
                    music_url = players.playlisturl[playid];
                }
                if (!music_url){
                    var play_token = play.getAttribute('data-token');
                    if (play_token){
                        ajax({
                            'url':'/plugin-url-'+playid,
                            'type':'GET',
                            'data':{'token':play_token},
                            success:function(url){
                                music_url = url;
                                int_play();
                            }
                        });
                    }
                }else{
                    int_play();
                }

                music.onloadedmetadata = function(){
                    if (music){
                        play_duration.innerHTML = s_to_hs(music.duration);
                        if (!isNaN(music.duration)){
                            play_progress.max = music.duration;
                        }
                    }
                    play_volume_range.value = play_vol.innerText = players.player_vol.innerText;
                }

            }else if (playid){
                if (music){
                    music.remove();
                    music = false;
                }
                play_id = playid;
                reset_state();
            }else{
                audio.autoplay = true;
            }
        }

        
        if (!document.createElement('audio').canPlayType){
            if (o_audio = play.querySelector('audio')){
                o_audio.style.display = 'block';
                o_audio.src = music_url;
            }
        }


        //重置播放器
        reset_state = function (){
            play_duration.innerHTML = s_to_hs(audio.duration);
            if (!isNaN(audio.duration)){
                play_progress.max = audio.duration;
            }
            play_volume_range.value = Math.floor(audio.volume*100);
            play_vol.innerHTML = Math.floor(audio.volume*100);
            
            if (!audio.paused && !music){
                play_pause.id = 'btn-pause';
                play_cover.className = 'cover c';
            }
            if (audio.playbackRate > 1){
                play_front.className = 'c';
                play_after.className = '';
            }if (audio.playbackRate < 1){
                play_front.className = '';
                play_after.className = 'c';
            }
            if (audio.muted){
                play_mute.className = 'c';
            }
            if (audio.loop){
                play_loop.className = 'c';
            }
            if ( radio && playlisi != undefined ){
                list_play(playlisi);
            }
        }
    
        //电台
        radios = function (){
            if (radio = document.getElementById('radio')){
                var o_ids = ids;

                lists = document.getElementsByClassName('playlist')[0];
                list = lists.getElementsByTagName('li');
                title = radio.getElementsByTagName('h2')[0];
                ids = '';

                for(var i=0; i<list.length; i++){
                    var ti = list[i].getElementsByTagName('i')[0];
                    var id = ti.innerText;
                    var a = list[i].getElementsByTagName('a')[0];
                    var name = a.innerText;
                    ids += id+'.';
                    playlist[i] = {'i':i,'id':id,'name':name};
                    //a.href = 'javascript:list_play('+i+');';
                    a.setAttribute('i',i);
                    a.setAttribute('onclick','list_play('+i+');');
                    ti.setAttribute('onclick','list_remove('+i+');');
                    a.removeAttribute('href');
                    a.removeAttribute('target');
                }
                add_playlist(playlist);

                if (o_ids == ids){
                    reset_state();
                    return true;
                }
    
                if (ids){
                    var data = [];
                    data['ajax'] = true;
                    data['type'] = 'radio';
                    data['id'] = ids;
                    data['token'] = radio.getAttribute('data-token');
                    data['page'] = radio.getAttribute('data-page');
                    data['radio'] = radio.getAttribute('data-radio');
                    ajax({
                        'url':'/plugin-playlist',
                        'type':'post',
                        'data':data,
                        success:function(data){
                            try {
                                playlisturl = JSON.parse(data);
                                add_playlisturl(playlisturl);
                                list_play(0);
                            } catch(e) {
                                dialog(data);
                            }
                        }
                    });
                    var radio_page = radio.getAttribute('page');
                    if (data['radio']){
                        radio_url = '/radio-'+data['radio'];
                        if (radio_page){
                            radio_url += '-'+radio_page;
                        }
                    }else{
                        radio_url = '/radio';
                        if (radio_page){
                            radio_url += '--'+radio_page;
                        }
                    }
                }
            }
        }
        radios();

        if (document.getElementById('radio')){
            document.querySelector('.players').classList.remove('c');
            document.querySelector('.players').classList.add('r');
        }else{
            document.querySelector('.players').classList.remove('r');
            document.querySelector('.players').classList.add('c');
        }
    
        //开始加载音频
        audio.onloadstart = function(){
            play_pause.id = '';
            players.plarer_state.innerHTML = play_pause.innerHTML = '加载中';
        }
        audio.onloadedmetadata = function(){
            players.plarer_state.innerHTML = play_pause.innerHTML = '完成';
            if (document.querySelector('.play') != null && audio.id == (play.getAttribute('data-id') || play_id) ){
                players.player_duration.innerText = play_duration.innerHTML = s_to_hs(audio.duration);
                players.player_progress.max = play_progress.max = audio.duration;
                players.player_vol.innerHTML = play_vol.innerHTML = Math.floor(audio.volume*100);
            }else{
                players.player_duration.innerText = s_to_hs(audio.duration);
                players.player_progress.max = audio.duration;
                players.player_vol.innerHTML = Math.floor(audio.volume*100);
            }
        }
        audio.onloadeddata = function(){
            players.plarer_state.innerHTML = play_pause.innerHTML = '';
            if (audio.paused){
                play_pause.id = 'btn-play';
            }else{
                play_pause.id = 'btn-pause';
            }
        }


        //列表播放
        play_playlist = function (id){
            var showlist = players.play_list.querySelectorAll('li:not([class="r"])');
            if (showlist.length == 0){
                dialog('没有更多歌曲了');
                return false;
            }
            if (!id){
                id = Object.keys(players.playlist)[0];
            }else if ( 0 > id ){
                var ks = Object.keys(players.playlist);
                id = ks[ks.length-1];
            }
            if (!players.playlist[id]){
                return false;
            }
            if (players.playlisturl[id]){
                audio.src = players.playlisturl[id];
                audio.autoplay = true;
                audio.load();
                audio.play();
                setCookie('audio_id',id,3600);
            }else{
                // var lists = players.playlist;
                // var urls = players.playlisturl;
                // var list = Object.assign(lists,urls);
            }
            audio.id = play_id = id;
            play_playlistui(id);

            var d_players = document.querySelector('.players');
            if ( audio.id == (play.getAttribute('data-id') || play_id) ){
                if ( document.querySelector('.play') != null ){
                    d_players.classList.remove('c');
                    d_players.classList.add('r');
                }
            }else if(d_players.className == 'players r'){
                d_players.classList.remove('r');
                d_players.classList.add('c');
            }
        }

        //清空列表
        clear_playlist = function (){
            players.playlist = {};
            players.playlisturl = {};
            play_playlistui();
            idb_music('name','clear');
            idb_music('url','clear');
        }

        //移除列表
        remove_playlist = function (id){
            var rid = players.play_list.querySelector('li[data-id="'+id+'"]');
            if (rid){
                rid.classList.add('r');
                rid.removeAttribute('onclick');
                rid.querySelector('span').removeAttribute('onclick');
                delete players.playlist[id];
                delete players.playlisturl[id];
                idb_music('name',id);
                idb_music('url',id);
                var k = Object.keys(players.playlist);
                players.player_list.innerText = '列表'+(k.length);
            }
        }
    
        //列表切换
        list_play = function (i){
            var showlist = lists.querySelectorAll('li:not([class="r"])');
            if (showlist.length == 0){
                dialog('没有更多歌曲了');
                return false;
            }
            if (!playlist[i]){
                if (i < 0){
                    i = playlist[ Object.keys(playlist).length-1 ].i;
                }else{
                    i = Object.values(playlist)[0].i;
                }
            }
            if (!playlist[i]){
                list_remove(i);
                list_play(i);
                return false;
            }
            playlisi = i;
            if (playlist[i].id != audio.id){
                if (!music || (play && play.getAttribute('data-id')) ){
                    audio.src = playlisturl[playlist[i].id];
                    play_id = audio.id = playlist[i].id;
                    document.title = playlist[i].name;
                    players.player_title.innerHTML = playlink(i,playlist[i].name);
                    setCookie('audio_id',playlist[i].id,3600);
                }
                play_duration.innerHTML = '00:00';
                play_current.innerHTML = '00:00';
            }
            if (music){
                music.src = playlisturl[playlist[i].id];
            }
            audio.autoplay = true;
            for(var ii=0; ii<list.length; ii++){
                list[ii].classList.remove('c');
            }
            list[i].classList.add('c');
            title.innerHTML = playlink(playlist[i].id,playlist[i].name);
            if (document.getElementById('radio')){
                play_cover.getElementsByTagName('img')[0].src = '/plugin-image-'+playlist[i].name+'.jpg';
            }
            if (play_down){
                play_down.setAttribute('download',playlist[i].name);
            }
        }
    
        //移除列表
        list_remove = function (i){
            if (list){
                list[i].classList.add('r');
                delete playlist[i];
                delete playlisturl[i];
            }
        }
    
        //上一曲
        players.player_prev.onclick = play_prev.onclick = function(){
            if (!document.getElementById('radio')){
                var id;
                var k = Object.keys(players.playlist);
                if (k.length == 0){
                    dialog('列表没有更多歌曲');
                    return false;
                }
                if (!audio.id){
                    audio.id = getCookie('audio_id') || 1;
                }
                if (players.playmode == 'one'){
                    id = audio.id;
                }else if (players.playmode == 'loop'){
                    var i = k.indexOf(audio.id);
                    if( 0 > i ){
                        id = k[k.length-1];
                    }else{
                        id = k[i-1];
                    }
                    play_playlist(id);
                }else if (players.playmode == 'shuffle'){
                    id = k[ Math.floor(Math.random()*k.length) ];
                }

                play_playlist(id);
            }else if (playlisi != undefined){
                list_play(playlisi-1);
            }
        }
        
    
        //下一曲
        players.player_next.onclick = play_next.onclick = function(){
            if (!document.getElementById('radio')){
                var id;
                var k = Object.keys(players.playlist);
                if (k.length == 0){
                    dialog('列表没有更多歌曲');
                    return false;
                }
                if (!audio.id){
                    audio.id = getCookie('audio_id') || 1;
                }
                if (players.playmode == 'one'){
                    id = audio.id;
                }else if (players.playmode == 'loop'){
                    var i = k.indexOf(audio.id);
                    if(i >= k.length){
                        id = k[0];
                    }else{
                        id = k[i+1];
                    }
                    play_playlist(id);
                }else if (players.playmode == 'shuffle'){
                    id = k[ Math.floor(Math.random()*k.length) ];
                }

                play_playlist(id);
            }else if (playlisi != undefined){
                list_play(playlisi+1);
            }
        }
        
    
        //播放暂停
        players.player_playpause.onclick = play_pause.onclick = function(){
            if (this == play_pause){
                if (music){
                    if (play.getAttribute('data-id')){
                        play_id = play.getAttribute('data-id');
                    }
                    audio.id = play_id;
                    if (music_url){
                        audio.src = music_url;
                    }
                    audio.autoplay = true;
                    music.remove();
                    music = false;
                }
                if (radio){
                    list_play(playlisi);
                }
            }else{
                audio.autoplay = true;
                if (!audio.src){
                    play_playlist( getCookie('audio_id') || 1 );
                    audio.play();
                    players.player_playpause.innerText = '暂停';
                    players.player_playpause.classList.add('c');
                    if (!music && play_pause.id != 'player-playpause'){
                        play_pause.id = 'btn-pause';
                    }
                    return true;
                }
            }
            if (audio.paused){
                audio.play();
                players.player_playpause.innerText = '暂停';
                players.player_playpause.classList.add('c');
                if (!music && play_pause.id != 'player-playpause'){
                    play_pause.id = 'btn-pause';
                }
            }else{
                audio.pause();
                players.player_playpause.innerText = '播放';
                players.player_playpause.className = '';
                if (!music && play_pause.id != 'player-playpause'){
                    play_pause.id = 'btn-play';
                }
            }
            //play_pause.innerHTML = '';
        }
        document.onkeyup = function (e){
            if (e.keyCode == 32){
                players.player_playpause.onclick();
            }
        }

    
        //快速
        players.player_front.onclick = play_front.onclick = function(){
            if (audio.playbackRate == 1){
                audio.playbackRate = 1.5;
                players.player_front.className = play_front.className = 'c';
            }else{
                audio.playbackRate = 1;
                players.player_front.className = play_front.className = '';
            }
            players.player_after.className = play_after.className = '';
        }
        
    
        //慢速
        players.player_after.onclick = play_after.onclick = function(){
            if (audio.playbackRate == 1){
                audio.playbackRate = 0.5;
                players.player_after.className = play_after.className = 'c';
            }else{
                audio.playbackRate = 1;
                players.player_after.className = play_after.className = '';
            }
            players.player_front.className = play_front.className = '';
        }
        
    
        //封面
        if (play_cover){
            play_cover.onclick = function(){
                document.body.style.backgroundImage='url('+play_cover.getElementsByTagName('img')[0].src+')';
                document.body.style.opacity = '0.96';
                document.body.style.filter = "alpha(opacity=96%)";
            }
        }
    
        //进度条
        players.player_progress.onclick = play_progress.onclick = function(e){
            var v = audio.duration * (e.offsetX/this.clientWidth);
            if (this == play_progress){
                if (music){
                    return false;
                }
                play_progress.value = v;
            }
            audio.currentTime = players.player_progress.value = v;
        }
    
        //静音
        players.player_mute.onclick = play_mute.onclick = function(){
            if (audio.muted){
                audio.muted = false;
                players.player_mute.className = play_mute.className = '';
            }else{
                audio.muted = true;
                players.player_mute.className = play_mute.className = 'c';
            }
        }
    
        //单曲循环
        players.player_mode.onclick = play_loop.onclick = function(){
            if (this == players.player_mode){
                if (players.playmode == 'loop'){
                    players.playmode = 'shuffle';
                    players.player_mode.innerText = '随机';
                    setCookie('player_playmode',players.playmode,3600);
                    return true;
                }
            }
            if (audio.loop){
                audio.loop = false;
                players.player_mode.className = play_loop.className = '';
                players.playmode = 'loop';
                players.player_mode.innerText = '顺序';
            }else{
                audio.loop = true;
                players.player_mode.className = play_loop.className  = 'c';
                players.playmode = 'one';
                players.player_mode.innerText = '单曲';
            }
            setCookie('player_playmode',players.playmode,3600);
        }
        if (player.playmode == undefined){
            player.playmode = getCookie('player_playmode') || 'loop';
            if (player.playmode == 'shuffle'){
                players.player_mode.innerText = '随机';
            }else if (player.playmode == 'one'){
                audio.loop = true;
                players.player_mode.className = 'c';
                players.player_mode.innerText = '单曲';
            }else{
                players.player_mode.innerText = '顺序';
            }
        }
        if (audio.loop && play.getAttribute('data-id')){
            play_loop.className = 'c';
        }

        
        //秒转分秒
        function s_to_hs(s){
            var h = ''+Math.floor(s/60);
            s = ''+Math.floor(s%60);
            h = (h.length==1)?'0'+h:h;
            s = (s.length==1)?'0'+s:s;
            return h+':'+s;
        }
    
        //音量
        var audio_volume = function(){
            audio.volume = this.value/100;
            players.player_volume.value = play_volume_range.value = players.player_vol.innerText = play_vol.innerText = Math.floor(this.value * 100) / 100;
            setCookie('player_volume',audio.volume,3600);
        }
        if (play_volume_range){
            play_volume_range.addEventListener("input",audio_volume);
            play_volume_range.addEventListener("change",audio_volume);
        }
        players.player_volume.addEventListener("input",audio_volume);
        players.player_volume.addEventListener("change",audio_volume);
        
        //音频结束
        audio.addEventListener('ended',function(){
            if (document.getElementById('radio') && playlisi != undefined){
                list_play(playlisi+1);
                return true;
            }else if(!play.getAttribute('data-id') || audio.id != play.getAttribute('data-id')){
                var k = Object.keys(players.playlist);
                if (k.length < 2 && audio.duration < 10){
                    audio.currentTime = players.player_progress.value = 0;
                    players.player_current.innerText = '00:00';
                    return false;
                }
                players.player_next.onclick();
            }else if (!audio.loop){
                audio.currentTime = players.player_progress.value = play_progress.value = 0;
                audio.pause();
                players.player_current.innerText = play_current.innerText = '00:00';
                players.player_playpause.innerText = '播放';
                if (!music){
                    play_pause.id = 'btn-play';
                }
            }
        },false);

        //音频播放
        audio.addEventListener('play',function(){
            if (!audio.src){
                return false;
            }
            interval = setInterval(function(){
                if ( audio.id == (play.getAttribute('data-id') || play_id) ){
                    players.player_progress.value = play_progress.value = audio.currentTime;
                    players.player_current.innerText = play_current.innerText = s_to_hs(audio.currentTime);
                }else{
                    players.player_progress.value = audio.currentTime;
                    players.player_current.innerText = s_to_hs(audio.currentTime);
                }
            },100);

            players.player_playpause.innerText = '暂停';
            players.player_playpause.classList.add('c');

            if ( audio.id == (play.getAttribute('data-id') || play_id) && document.getElementById('play-title')){
                play_cover.className = 'cover c';
                play_pause.id = 'btn-pause';

                var this_play_title = document.getElementById('play-title').innerText;
                document.title = this_play_title;
                players.player_title.innerHTML = playlink(audio.id,this_play_title);
                if ( players.playlist[audio.id] ){
                    document.title = players.playlist[audio.id];
                    players.player_title.innerHTML = playlink(audio.id,players.playlist[audio.id]);
                    play_playlistui(audio.id);
                }
                document.querySelector('.players').classList.remove('c');
                document.querySelector('.players').classList.add('r');
            }else{
                document.title = document.getElementById('player-title').innerText;
                play_current.innerText = '00:00';
                play_cover.className = 'cover';
                play_pause.id = 'btn-play';
                music = document.createElement('audio');
            }
            
            if (play_loop){
                if (audio.loop){
                    players.player_mode.className = play_loop.className = 'c';
                    players.playmode = 'one';
                    players.player_mode.innerText = '单曲';
                }else{
                    players.player_mode.className = play_loop.className = '';
                }
            }
        },false);
    

        //暂停
        audio.addEventListener('pause',function(){
            clearInterval(interval);
            play_cover.className = 'cover c p';
            play_pause.id = 'btn-play';
            players.player_playpause.innerText = '播放';
            players.player_playpause.className = '';
        },false);
    

        //错误
        audio.onerror = function(e){
            if (document.getElementById('radio') != null && playlisi != undefined){
                list_remove(playlisi);
                list_play(playlisi+1);
            }else if(!play.getAttribute('data-id') || audio.id != play.getAttribute('data-id')){
                players.player_next.onclick();
                remove_playlist(audio.id);
            }else{
                if (o_audio = play.querySelector('audio')){
                    o_audio.style.display = 'block';
                    o_audio.src = music_url;
                }
            }
        };

    
        //下载
        function downloads(_this,url){
            if (_this.getAttribute('data-token')){
                var data = [];
                data['download[id]'] = _this.getAttribute('data-id');
                var download = data['download[download]'] = _this.getAttribute('data-download');
                data['ajax'] = true;
                data['token'] = _this.getAttribute('data-token');
                //var _this = this;
                ajax({
                    'url':'/plugin-download',
                    'type':'post',
                    'data':data,
                    success:function(data){
                        if (data=='ok'){
                            if (_this.getElementsByTagName('i')){
                                _this.getElementsByTagName('i')[0].innerHTML = (parseInt(download)+1);
                            }else{
                                _this.innerHTML = '下载'+(parseInt(download)+1);
                            }
                            var play_download;
                            if (play_download = document.getElementById('play_download')){
                                play_download.innerHTML = (parseInt(play_download.innerText)+1);
                            }
                            _this.removeAttribute('data-token');
                        }
                    }
                });
            }
    
            const a = document.createElement('a');
            a.download = _this.getAttribute('download');
            a.target = '_blank';
            if (url || music_url || audio.src){
                a.href = url || music_url || audio.src;
                a.click();
            }else{
                dialog('无法下载');
            }
            //document.body.appendChild(a);
            a.remove();
            if (getCookie('sponsor') != '1'){
                if (document.querySelector('#sponsor')){
                    document.querySelector('#sponsor').checked = true;
                }
                setCookie('sponsor','1',120);
            }
        }
    
        //下载
        if (document.getElementById('download')){
            document.getElementById('download').onclick = function(){
                downloads(this,music_url);
            }
        }
        if (play_down){
            play_down.onclick = function(){
                downloads(this,playlisturl[playlist[playlisi].id]);
            }
        }
        players.player_down.onclick = function(){
            downloads(this,audio.src);
        }

        //分享
        players.player_share.onclick = function(){
            if (players.player_title.querySelector('a[data-id]')){
                share(players.player_title.querySelector('a[data-id]').getAttribute('data-id'),players.player_title.innerText);
            }else{
                share(audio.id,players.player_title.innerText);
            }
        }

        if ( document.getElementById('play_share') ){
            document.getElementById('play_share').onclick = function(){
                share();
            }
        }
            
    //}
}
player();
idb_music('name');
idb_music('url');
if ( Object.keys(players.playlist).length == 0 ){
    add_playlist({id:'1',name:'土嗨DJ网',url:'/static/dj.mp3'});
}
// setTimeout(function(){
//     play_playlist( getCookie('audio_id') || 1 );
// },1000);


//动态翻页
var pages;
function page(){
    if ( pages = document.querySelectorAll('.page[data-for]') ){
        for(var i=0; i<pages.length; i++){
            pages[i].a = pages[i].getElementsByTagName('a');
            for(var ii=0; ii<pages[i].a.length; ii++){
                if (pages[i].a[ii].href){
                    pages[i].a[ii].setAttribute('data-href',pages[i].a[ii].href);
                }
                pages[i].a[ii].removeAttribute('href');
                pages[i].a[ii].removeAttribute('target');
                pages[i].a[ii].setAttribute('data-for',pages[i].getAttribute('data-for'));
    
                pages[i].a[ii].onclick = function (){
                    if (this.getAttribute('data-href')){
                        var data = [];
                        data['ajax'] = true;
                        data['list'] = this.getAttribute('data-for').substr(1);
                        var _this = this;
                        ajax({
                            'url': this.getAttribute('data-href'),
                            'type':'GET',
                            'data':data,
                            success:function(data){
                                try {
                                    var list_data = JSON.parse(data);
        
                                    document.querySelectorAll(_this.getAttribute('data-for'))[0].innerHTML = list_data.list;
        
                                    document.querySelectorAll('.page[data-for="'+_this.getAttribute('data-for')+'"]')[0].innerHTML = (list_data.page).replace('href=', "data-href=");
                                    
                                    page();
                                    if (document.getElementById('radio')){
                                        if (list_data.data_page){
                                            document.getElementById('radio').setAttribute('page',list_data.data_page);
                                        }
                                        radios();
                                    }
                                } catch(e) {
                                    dialog(data);
                                }
                            }
                        });
                    }
                }
            }
        }
    }
}
page();


//初访重定向
var a_v;
var host = window.location.host;
if (a_v = window.location.hash.split("#")[1]){
    if (a_v.indexOf(host) != -1){
        top.location = a_v.replace(host+'/',host+'/#');
    }
    if (a_v.substr(0,1) == '/'){
        a_v = window.location.pathname;
        newpage();
    }
}else{
    adverts();
}

//链接点击
var a_s;
function alink(){
    if ( a_s = document.querySelectorAll('a[href]') ){
        for(var i=0; i<a_s.length; i++){
            if ( a_s[i].href && (a_s[i].href.indexOf('//'+host) > 0 && a_s[i].href.indexOf('#/') == -1 ) ){
                a_s[i].onclick = newpage;
                a_s[i].href = '#'+a_s[i].href.replace(window.location.protocol+"//"+host,'');
                a_s[i].target = '';
            }
        }
    }
}
alink();


//页面刷新
function newpage(){
    var av = a_v;
    if (a_v = window.location.hash.split("#")[1]){
        if (av == a_v){
            return true;
        }
        if (a_v.indexOf('/radio') > -1 && radio_url && !document.getElementById('radio')){
            a_v = window.location.hash = radio_url;
        }
        var data = [];
        ajax({
            'url': a_v,
            'type':'get',
            'data':data,
            success:function(data){
                var htmlbody = document.createElement('html');
                htmlbody.innerHTML = data;
                if (htmlbody.querySelectorAll('#body').length>0){
                    document.getElementById('body').innerHTML = htmlbody.querySelectorAll('#body')[0].innerHTML;
                }
                if (htmlbody.querySelectorAll('title').length>0){
                    document.title = htmlbody.querySelectorAll('title')[0].innerText;
                }
                if (htmlbody.querySelectorAll('meta[name="keywords"]').length>0){
                    document.querySelectorAll('meta[name="keywords"]')[0].outerHTML = htmlbody.querySelectorAll('meta[name="keywords"]')[0].outerHTML;
                }
                if (htmlbody.querySelectorAll('meta[name="description"]').length>0){
                    document.querySelectorAll('meta[name="description"]')[0].outerHTML = htmlbody.querySelectorAll('meta[name="description"]')[0].outerHTML;
                }

                page();
                alink();
                player();
                ajaxform();
                search();
                likes();
                share();
                adverts();
                if (document.documentElement.scrollTop > document.body.offsetHeight / 2){
                    document.body.scrollTop=document.documentElement.scrollTop = 0;
                }
                cmpt_http();
                analytics();
            }
        });
    }
}
window.onpopstate = newpage;

// 兼容模式
function cmpt_http(){
    if ('https:' == document.location.protocol){
        var nav = document.querySelector('footer>nav');
        if (nav){
            var a = document.createElement('a');
            a.href = window.location.href.replace(/^https/,'http');
            a.title = '当无法播放时可切换成兼容模式';
            a.innerText = '兼容模式';
            nav.appendChild(a);
        }
    }
}
cmpt_http();

//分享
function share(music_id,music_name){
    var share_box;
    if ( share_box = document.querySelector('dialog.share')){
        
        var name = music_name || document.querySelector('h1').innerText;
        var url = window.location.href;
        if (music_id){
            url = playlink(music_id);
        }else{
            if (document.querySelector('.play[data-id]')){
                url = playlink( document.querySelector('.play[data-id]').getAttribute('data-id') );
            }else if(audio.id){
                url = playlink( audio.id );
            }
        }
        var img = window.location.origin+'/plugin-image-'+name+'.jpg';
        var txt = name+'在线试听下载';
        var site = '土嗨DJ网';

        var html = '';
		html += '<a href="http://service.weibo.com/share/share.php?url='+url+'&title='+ encodeURIComponent("#电子音乐# "+txt) +'&pic='+img+'" target="_blank">新浪微博</a>';
		html += '<a href="https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url+'&title='+txt+'&pics='+img+'&site='+site+'" target="_blank">QQ空间</a>';
		html += '<a href="http://tieba.baidu.com/f/commit/share/openShareApi?url='+encodeURIComponent(url)+'&title='+txt+'&pic='+img+'&site='+site+'" target="_blank">百度贴吧</a>';
		html += '<a href="https://www.douban.com/share/service?href='+url+'&name='+name+'&image='+img+'&site='+site+'&text='+encodeURIComponent(txt)+'" target="_blank">豆瓣</a>';
		html += '<a href="https://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(url)+'&title='+name+'&pics='+img+'&desc='+encodeURIComponent(txt)+'" target="_blank">QQ好友</a>';
		html += '<a href="http://widget.renren.com/dialog/share?resourceUrl='+url+'&title='+name+'&pic='+img+'&description='+encodeURIComponent(txt)+'" target="_blank">人人网</a>';
		html += '<a href="https://www.facebook.com/share.php?u='+url+'&t='+txt+'&pic='+img.replace('https://','http://')+'" target="_blank">Facebook</a>';
		html += '<a href="https://twitter.com/intent/tweet?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt)+'&pic='+encodeURIComponent(img)+'&hashtags=dj" target="_blank">Twitter</a>';
		html += '<a href="mailto:?subject='+name+'&body='+txt+url+'" target="_blank">电子邮件</a>';
        html += '<a href="sms:?body='+txt+url+'" target="_blank">短信</a>';
        
        share_box.querySelector('.title').innerText = '分享《'+name+'》';
        share_box.querySelector('section').innerHTML = html;
    }
}
share();

//提示
function dialog(v){
    var x = document.createElement('DIALOG');
    var t = document.createTextNode(v);
    x.setAttribute('open','open');
    x.appendChild(t);
    document.body.appendChild(x);
    c = setTimeout(function(){document.body.removeChild(x);},5000);
    x.onmouseover = function(){
        clearTimeout(c);
    };
    x.onmouseout = function(){
        c = setTimeout(function(){document.body.removeChild(x);},5000);
    };
    x.onclick = function(){
        addClass(x,'c');
    }
}

//搜索
function search(){
    var form = document.querySelector('header>form');
    var search = form.querySelector('input[type="search"]');
    var submit = form.querySelector('input[type="submit"]');
    form.onsubmit = function(){
        if (search.value.length < 2){
            dialog('关键词需要2位以上');
            search.focus();
            return false;
        }
        location.href = '#/s-'+search.value.replace('-',' ');
        return false;
    }
}
search();

//点赞
function likes(){
    function like(){
        var data = [];
        data['token'] = this.getAttribute('data-token');
        data['like[type]'] = this.getAttribute('data-type');
        if (!data['token']){
            data['token'] = document.getElementById(data['like[type]']+'-token').value;
        }
        if (data['token']){
            data['like[id]'] = this.getAttribute('data-id');
            var like = data['like[like]'] = this.getAttribute('data-like');
            data['ajax'] = true;
            data['like[fid]'] = this.getAttribute('data-fid');
            var _this = this;
            ajax({
                'url':'/plugin-like',
                'type':'post',
                'data':data,
                success:function(data){
                    if (data=='ok'){
                        if (_this.getElementsByTagName('i').length > 0){
                            _this.getElementsByTagName('i')[0].innerHTML = (parseInt(like)+1);
                        }else{
                            _this.innerHTML = '点赞'+(parseInt(like)+1);
                        }
                        dialog('点赞成功');
                        _this.removeAttribute('data-token');
                    }else{
                        dialog(data);
                    }
                }
            });
        }else{
            dialog('点过赞了');
        }
        return false;
    }

    if(document.getElementById('like')){
        document.getElementById('like').onclick = like;
    }

    if(comment = document.getElementById('comment')){
        var likes = comment.querySelectorAll('button[type="submit"]');
        for(var i=0; i<likes.length; i++){
            likes[i].onclick = like;
        }
    }
    
}
likes();

//ajax提交
var formos = [];
function ajaxform(){
    if(forms = document.getElementsByClassName('ajax')){
        formos = [];
        for(var i=0; i<forms.length; i++){
            formos[i] = {};
            formos[i].method = forms[i].getAttribute('method');
            formos[i].action = forms[i].getAttribute('action');
            if (!formos[i].action){ formos[i].action = window.location.href; }
            formos[i].submit = forms[i].querySelector('input[type="submit"]');
            if (!formos[i].submit){
                formos[i].submit = forms[i].querySelector('button[type="submit"]');
            }
            formos[i].submit.i = i;
            formos[i].data = {ajax:true};
            formos[i].inputs = forms[i].getElementsByTagName("input");
            formos[i].textareas = forms[i].getElementsByTagName("textarea");
    
            formos[i].submit.onclick = function(){
                var i = this.i;
                for(var ii=0; ii<formos[i].inputs.length; ii++){
                    if (formos[i].inputs[ii].hasAttribute('required')){
                        if (formos[i].inputs[ii].value == ''){
                            formos[i].inputs[ii].focus();
                            dialog('请填写内容');
                            return false;
                        }
                    }
                    if (formos[i].inputs[ii].hasAttribute('minlength')){
                        if ( formos[i].inputs[ii].value.length < parseInt(formos[i].inputs[ii].getAttribute('minlength')) ){
                            formos[i].inputs[ii].focus();
                            dialog('字数太少');
                            return false;
                        }
                    }
                    formos[i].data[formos[i].inputs[ii].name] = formos[i].inputs[ii].value;
                }
    
                for(var ii=0; ii<formos[i].textareas.length; ii++){
                    if (formos[i].textareas[ii].hasAttribute('required')){
                        if (formos[i].textareas[ii].value == ''){
                            formos[i].textareas[ii].focus();
                            dialog('请填写内容');
                            return false;
                        }
                    }
                    if (formos[i].textareas[ii].hasAttribute('minlength')){
                        if (formos[i].textareas[ii].value.length < parseInt( formos[i].textareas[ii].getAttribute('minlength') ) ){
                            formos[i].textareas[ii].focus();
                            dialog('字数太少');
                            return false;
                        }
                    }
                    formos[i].data[formos[i].textareas[ii].name] = formos[i].textareas[ii].value;
                }
    
                ajax({
                    'url': formos[i].action,
                    'type': formos[i].method,
                    'data': formos[i].data,
                    success:function(data){
                        if (data != '发布成功'){
                            dialog(data);
                        }else{
                            dialog('发布成功,等待审核');
                        }
                    }
                });

                return false;
            }
    
        }
    }
}

//iframe载入html
function iframe_html(e){
    var doc = e.contentWindow || e.contentDocument || e.document,
        id = e.getAttribute('id');
    doc.document.write('<html><head><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"><style>*{margin:0;padding:0;overflow-y:hidden;overflow-x:auto;::-webkit-scrollbar{width:0.7rem;height:0.7rem}::-webkit-scrollbar-thumb{background-color: #261a24;background-clip: padding-box; cursor: pointer;border-radius: 2px;}::-webkit-scrollbar-thumb:hover{background-color: #000;}::-webkit-scrollbar-track{background-color: #e1e5ea;}}</style><script>function h(){var h=document.body.offsetHeight||document.body.scrollHeight;if(h>0){window.parent.document.getElementById("'+id+'").height=h;}}</script></head><body onload="h()">'+unescape(e.getAttribute('html'))+'<script>h();</script></body></html>');
    doc.onresize = function(){
        e.height = doc.document.body.offsetHeight;
    }
    setTimeout(function(){
        var e = document.getElementById(id);
        var doc = e.contentWindow || e.contentDocument || e.document;
        doc.onresize();
    },5000);
}

//广告
var advert_json;
function adverts(){
    if (!advert_json){
        advert_data();
        return false;
    }
    var m,s;
    if (s = a_v || window.location.pathname){
        m = s.substr(1).split('-')[0];
    }
    if (!m){
        m = 'index';
        if ( s != '' && s != '/' ){
            m = s;
        }
    }
    var now_time = Date.parse(new Date()) / 1000;
    for(var k in advert_json){
        var a_d = document.querySelector('.a[data-id="'+k+'"]');
        var a_html = '';
        if (a_d && advert_json[k].length > 0){
            for (var i=0; i< advert_json[k].length;i++){
                if ( (advert_json[k][i].page == 'all' || advert_json[k][i].page.indexOf('.'+m+'.') != -1) && now_time > advert_json[k][i].start_time && now_time < advert_json[k][i].end_time){

                    if(advert_json[k][i].type == ''){
                        a_html += '<div>'+advert_json[k][i].data+'</div>';
                    }else if(advert_json[k][i].type == 'js'){
                        a_html += '<iframe src="" id="'+k+i+'" html="'+escape(advert_json[k][i].data)+'" width="'+advert_json[k][i].width+'" height="'+advert_json[k][i].height+'" onload="iframe_html(this)"></iframe>';
                    }else{
                        a_html += '<a href="'+advert_json[k][i].url+'" target="_blank">';
                        if (advert_json[k][i].type == 'img'){
                            a_html += '<img src="'+advert_json[k][i].data+'"/>';
                        }else if(advert_json[k][i].type == 'txt'){
                            a_html += '<p>'+advert_json[k][i].data+'</p>';
                        }
                        a_html += '</a>';
                    }

                }
            }
            var advert_div = document.createElement('div');
            advert_div.innerHTML = a_html;
            a_d.appendChild(advert_div);
        }
    }
}
function advert_data(){
    var json = '/config/a.json';
    if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
        json = '/config/ma.json';
    }
    ajax({
        'url': json,
        'type':'get',
        'data': {},
        success:function(data){
            advert_json = JSON.parse(data);
            adverts(advert_json);
        }
    });
}

// analytics
function analytics(){
    if (document.getElementById('analytics')){
        document.getElementById('analytics').remove();
        var analytics_js = document.querySelectorAll('script[src*="googletagmanager.com"]');
        for (var i=0;i < analytics_js.length;i++){
            analytics_js[i].remove();
        }
    }
    var analyticsscript = document.createElement('script');
    analyticsscript.type = 'text/javascript';
    analyticsscript.async = true;
    analyticsscript.id = 'analytics';
    analyticsscript.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZHR6GGPQV8';
    var root_s = document.getElementsByTagName('script')[0];
    root_s.parentNode.insertBefore(analyticsscript, root_s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ZHR6GGPQV8');
}
analytics();