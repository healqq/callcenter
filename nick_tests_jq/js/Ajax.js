//сохраняет структуру сценария в 1С
function saveStructure() {
    var r=confirm("Внимание! Старая версия анкеты будет заменена! Продолжить?");
		if (r==true)
	{
		
	}
	else
	{
		return;
	}
    request = sendRequest("SetScriptStructure", [{key:'EncodedData', value: exportToJSON(["#container","#imported"])}]);
	request.done(function( msg ) {
		$( "#response" ).html( msg );
			reqAttr = $("#response").find("m\\:return").attr('xsi:nil');
			if (!(reqAttr == undefined) && $.parseJSON(reqAttr) == true ){
				redirect("auth.html");
			}
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
		});
            
}
//загружает структуру сценария из 1С
function loadStructure(type) {
    
    request = sendRequest("GetScriptStructure");
	request.done(function( msg ) {
		$( "#response" ).html( msg );
			reqAttr = $("#response").find("m\\:return").attr('xsi:nil');
			if (!(reqAttr == undefined) && $.parseJSON(reqAttr) == true ){
				redirect("auth.html");
				return;
				}
			//очищаем контейнеры
			
			first = importFromJSON( $( "#response" ).text(), "#imported", type);
			showBranch(first,false);
			if (drawerSingleton !== undefined){
				drawerSingleton.getInstance().init().draw();
			}
			$('#btnLoadStructureClient').slideUp('Slow');
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		});
            
}
//отправляет реквест с заданным экшеном и параметрами. возвращает объект request, 
//для которого нужно определить .done и .fail после вызова функции
function sendRequest(action, params){
	var wsUrl = 'ws/ws/callcenterexchange';
    var soapRequest = combineSoapRequest(action, params) ;
   // alert(soapRequest);
    var request = $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "html",
                    data: soapRequest
                });
	
	return  request;
}

//формирует soap реквест
function combineSoapRequest(action, arrayParam){
	var paramString = '';
	//параметр токен обязателен
	var sessionID = getCookie('PHPSESSID');
	if (sessionID == undefined){
		redirect("auth.html");
	}
	//params = [{key:'Token',value:sessionID}];
	paramString += fillParam('Token', sessionID); 
	
	if (! (arrayParam == undefined) ){ 
		for (var i=0; i< arrayParam.length;i++){
			paramString += fillParam(arrayParam[i].key, arrayParam[i].value);
		}
	}

var request =	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ctoc="www.1ctocallcenter.com">\
				<soapenv:Header/>\
				<soapenv:Body>\
				<ctoc:' + action + '>' + paramString + '\
				</ctoc:' + action + '>\
				</soapenv:Body>\
				</soapenv:Envelope>';
	return request;
}
function fillParam(key,value){
	return '<ctoc:'+key+'>'+value+'</ctoc:'+key+'>';
}
 



