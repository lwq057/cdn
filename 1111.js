var dialog_div = document.createElement('div');dialog_div.innerHTML='<q id="dialog-bg-2020" style="position:fixed;top:0;left:0;background:#000;opacity:0.85;filter:alpha(opacity=80);width:100%;height:100%;z-index:90"></q><div id="dialog-box-2020"><a href="https://tao.hooos.com/go?url=https://s.click.taobao.com/qeckLvu&model=%EF%BF%A5wq9xc7hGzEG%EF%BF%A5"><img style="width:100%;" src="https://cdn.jsdelivr.net/gh/lwq057/cdn@3.6/1111.png"></a><i onclick="dialog_close()" style="display:table;width:2rem;height:2rem;line-height:2rem;margin:0 auto;text-align:center;background-color:#000;color:#fff;border-radius:50%;cursor:pointer">✕</i></div>';dialog_div.style.display="none";document.body.appendChild(dialog_div);

var dialog_close = function (){
    var exp = new Date();
    exp.setTime(exp.getTime() + 60*60*1000);
    document.cookie = "dialog2020="+exp+";expires="+exp.toGMTString();
    dialog_hide();
}

var dialog_show = function (){
    document.getElementById('dialog-box-2020').setAttribute('style','position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);z-index:99');
    document.getElementById('dialog-bg-2020').style.display='block';
    document.querySelector('#dialog-box-2020>i').style.display="block";
    dialog_div.style.display="block";
}

var dialog_hide = function (){
    document.getElementById('dialog-box-2020').setAttribute('style','position:fixed;bottom:3rem;right:0;z-index:99;width:8rem;');
    document.getElementById('dialog-bg-2020').style.display='none';
    document.querySelector('#dialog-box-2020>i').style.display="none";
    dialog_div.style.display="block";
}

var arr,reg=new RegExp("(^| )dialog2020=([^;]*)(;|$)");
if(arr=document.cookie.match(reg)){
    dialog_hide();
}else{
    dialog_show();
}
