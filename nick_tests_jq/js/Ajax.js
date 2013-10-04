//сохраняет структуру сценария в 1С
function saveStructure() {
    
    request = sendRequest("SetScriptStructure", [{key:'EncodedData', value: exportToJSON(["#container","#imported"])}]);
	request.done(function( msg ) {
		$( "#response" ).html( msg );
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
		});
            
}
//загружает структуру сценария из 1С
function loadStructure() {
    
    request = sendRequest("GetScriptStructure");
	request.done(function( msg ) {
			$( "#response" ).html( msg );
			first = importFromJSON( $( "#response" ).text(), "#imported", false);
			showBranch(first,false);
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
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
 



