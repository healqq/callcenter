//получает значение input'а у div блока
function getInputValue(element){
	value = undefined;
	textAreaSelection 	= $(element).find("textarea");
	if (! (textAreaSelection.length == 0 ) ){
		value = {key:$(element).attr('id'), value:textAreaSelection.val()};
	}
	else{
		textBlocksSelection = $(element).find("input[type=text]");
		if (! (textBlocksSelection.length == 0 ) ){
			value = [];
			textBlocksSelection.each(function(){
			value.push({key:$(this).parents('.divacc').attr('id')+$(this).attr('placeholder').replace(RegExp(' ', 'g'),''), value:$(this).val()} );
				});
			}
		else{
			radioSelection 		= $(element).find("input[type=radio]:checked");
			value = {key:$(element).attr('id'), value:radioSelection.val()};
		}
	}
	return $.isArray(value)? value : [value];
	
	
	
	
}

function createDataList(){
	var dataString = '<data>';
	scriptBlocks = $("#container").children("div");
	scriptBlocks.each(function(){
	values = getInputValue(this);
		for (var i=0; i< values.length;i++){
			dataString += fillDataString(values[i].key, values[i].value);
		}
	});
	dataString += '</data>';
	//showError (escapeHTML((dataString)) );
	return dataString;
}

function fillDataString(key,value){
	return '<'+key+'>'+value+'</'+key+'>';
}



function sendData(){
	request = sendRequest("RecieveData", [ { key:'EncodedData', value: escapeHTML( createDataList() ) } ] );
	request.done(function( msg ) {
		$( "#response" ).html( msg );
			reqAttr = $("#response").find("m\\:return").attr('xsi:nil');
			if (!(reqAttr == undefined) && $.parseJSON(reqAttr) == true ){
				redirect("auth.html");
			}
			else{
				if ( $.parseJSON($("#response").find("m\\:return").html() ) == true ){
					//showError("Анкета отправлена!");
					showHelp("send", 15*1000);
					reloadStructure();
					view.getInstance().toggleElementState($("#btnSendData"));
				}
			}
			$('.waiting-layer').hide();
				});
	request.fail(function( jqXHR, textStatus ) {
		showError( "Request failed: " + textStatus);
		view.getInstance().toggleElementState($("#btnSendData"));
		$('.waiting-layer').hide();
		});
		
}

var escapeHTML = (function () {
    'use strict';
    var chr = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return function (text) {
        return text.replace(/[\"&<>]/g, function (a) { return chr[a]; });
    };
}());
//функция оповещает о начале заполнения скрипта

function fillingStarted() {
    
    request = sendRequest("ScriptFillingStarted",undefined,true);
	request.done(function( msg ) {
		$( "#response" ).html( msg );
			reqAttr = $("#response").find("m\\:return").attr('xsi:nil');
			if (!(reqAttr == undefined) && $.parseJSON(reqAttr) == true ){
				redirect("auth.html");
				return;
			}
			else{
				setCookie('PHPSESSID', getCookie('PHPSESSID'),{expires:24*60, path:'/'});
			}
		$('.waiting-layer').hide();	
		});
	request.fail(function( jqXHR, textStatus ) {
		showError( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		$('.waiting-layer').hide();
		});
            
}
