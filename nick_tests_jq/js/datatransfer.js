//получает значение input'а у div блока
function getInputValue(element){
	value = undefined;
	var syncMap = model.getInstance().api.getSyncMap();
	var $element = $(element);
	var mapElement = syncMap[$element.attr('id')];
	key =  ( (mapElement === undefined)?$element.attr('id'):mapElement.value );
	textAreaSelection 	= $element.find("textarea");
	if (! (textAreaSelection.length == 0 ) ){
		
		
		value = {key:key, value:textAreaSelection.val()};
	}
	else{
		textBlocksSelection = $element.find("input[type=text]");
		if (! (textBlocksSelection.length == 0 ) ){
			value = [];
			
			
			textBlocksSelection.each(function(){
				var mapElement = syncMap[$element.attr('id')+$(this).attr('placeholder')];
				var key = (mapElement === undefined)?
				$element.attr('id')+$(this).attr('placeholder').replace(RegExp(' ', 'g'),''):mapElement.value;
				//key:$(this).parents('.divacc').attr('id')+$(this).attr('placeholder').replace(RegExp(' ', 'g'),'')
				value.push({key: key, value:$(this).val()} );
				});
			}
		else{
			radioSelection 		= $element.find("input[type=radio]:checked");
	//		key =  syncMap[$element.attr('id')].value;
			value = {key:key, value:radioSelection.val()};
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
		model.getInstance().api.onRequestFail("При отправке анкеты произошла ошибка, попробуйте ещё раз!", jqXHR);
		//model.getInstance().api.showError( "Request failed: " + textStatus);
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
				setCookie('PHPSESSID', getCookie('PHPSESSID'),{expires:24*60, path:'/Callcenter'});
			}
		$('.waiting-layer').hide();	
		});
	request.fail(function( jqXHR, textStatus ) {
		setTimeout(fillingStarted(), 5*1000);
		//model.getInstance().api.showError( "Не удалось выполнить запрос к серверу по причине: " + textStatus );
		$('.waiting-layer').hide();
		});
            
}
