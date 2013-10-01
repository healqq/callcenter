function saveStructure() {
    
    var wsUrl = 'ws/ws/callcenterexchange';
    var soapRequest = combineSoapRequest("SetScriptStructure",[{key:'EncodedData', value: exportToJSON("#container")}]) ;
    alert(soapRequest);
    var request = $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "html",
                    data: soapRequest
                });
	request.done(function( msg ) {
		$( "#response" ).html( msg );
		});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
		});
            
}

function processSuccess(data, status, req) { 
	alert('success');
    if (status == "success")
		$("#response").text($(req.responseXML).find("Result").text());
    alert(req.responseXML);
}

function processError(data, status, req) {
    alert('err'+data.state);
            //alert(req.responseText + " " + status);
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
 




