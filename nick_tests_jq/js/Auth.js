//устанавливает куку
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
  	options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) { 
      updatedCookie += "=" + propValue;
     }
  }

  document.cookie = updatedCookie;
}
//получает куку по имени или undefined
function getCookie(name) {

  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;

}
//очищает куку по имени
function removeCookie(name){
	setCookie(name, "deleted", {expires:-24*60*60,path:'/'});
}
//проверяет наличие сессии в куках
function checkSession(){
	var cookieSESSID = getCookie('PHPSESSID');
	if (cookieSESSID == undefined) {
		//show login page
		redirect("auth.html");
		
		//auth(login, pwd);
		//start new session ( send request login, pwd )
	}
	else{
		confimSession(cookieSESSID);
		//send request with sessid
	}
}
//при нажатии кнопки логин
function login(){
	$('.waiting-layer').show();
	$('error').slideUp('fast');
	
	$('#error').empty();
	login = $("#login").val();
	pwd	  = $("#pwd").val();
	var login_pattern = /^[a-zA-Z0-9]{3,30}$/;
	var pwd_pattern = /^[a-zA-Z0-9]{6,30}$/;
	//проверка логина и пароля регуляркой
	if (login_pattern.test(login) && pwd_pattern.test(pwd) ){
	//	alert('all ok');
		auth(login, pwd);
	}
	else{
		$('.waiting-layer').hide();
		$('#error').append('<h3>Неправильная пара логин пароль!</h3>');
		$('#error').slideDown('fast');
		//return false;
	}
	
}
function auth(login, pwd){
	params = [{key:'Login',value:login},{key:'Pwd',value:pwd}]; 
	//тут надо добавить кодирование пароля
	request = sendRequest("auth",params);
	request.done(function (msg){
		$( "#response" ).html( msg );
		SESSID =  $.trim($( "#response" ).text());
		//alert(SESSID);
		if ( !(SESSID == "") ){
			//all ok
			setCookie('PHPSESSID', SESSID,{expires:60*60*60, path:'/'});
			redirect("index.html");
		}
		else{
			$('.waiting-layer').hide();
			$('#error').append('<h3>Неправильная пара логин пароль!</h3>');
			$('#error').slideDown('fast');
			
			
		}
		//showBranch(first,false);
	});
	request.fail(function( jqXHR, textStatus ) {
		$('.waiting-layer').hide();
		$('#error').append( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		$('#error').slideDown('fast');
		});
}
//проверка, что текущая сессия существует на сервере
function confimSession(sessionID){
	//params = [{key:'Token',value:sessionID}];
	request = sendRequest("CheckSession");
	request.done(function (msg){
		
		$( "#response" ).html( msg );
		reqAttr = $("#response").find("m\\:return").attr('xsi:nil');
		if (!(reqAttr == undefined) && $.parseJSON(reqAttr) == true ){
				removeCookie('PHPSESSID');
				redirect("auth.html");
				return;
			}		
		sessionType =  $.trim($( "#response" ).text());
		//alert(SESSID);
		if ( sessionType == "admin" ) {
			//all ok
			setCookie('PHPSESSID', sessionID,{expires:60*60*60, path:'/'});
			redirect("index.html");
			//return true;
		}
		else{
		
		
			//alert("Неправильная пара логин пароль!");
			setCookie('PHPSESSID', sessionID,{expires:60*60*60, path:'/'});
			redirect("client.html");
			//window.location.replace("auth.html");
			//return false;
		}
		$('.waiting-layer').hide();
		//showBranch(first,false);
	});
	request.fail(function( jqXHR, textStatus ) {
		$('.waiting-layer').hide();
		alert( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		});
	
}
function redirect(path){
	var findString = '/Callcenter/';
	var href  	   = String(window.location.href.toString());
	index = href.search('/Callcenter/');
	basePath = href.substring(0,index + findString.length);
	if (!(window.location.href == basePath+path)){
			$(window).off('beforeunload');
			window.location.replace(path);
	
	}
}

function logout(){
	//var sessionID = getCookie('PHPSESSID');
	//params = [{key:'Token',value:sessionID}];
	$(window).off('beforeunload');
	var r=confirm("Вы действительно хотите выйти?");
		if (r==true)
	{
		
	}
	else
	{
		$(window).on('beforeunload',function(){
		
			return "Внимание! Вся несохранённая информация будет потеряна! ";
		
	});
		return;
	}
	request = sendRequest("Logout");
	request.done(function (msg){
			removeCookie('PHPSESSID');
			redirect("auth.html");
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		$('.waiting-layer').hide();
		});
		//showBranch(first,false);
}

