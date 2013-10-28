function appendElement(element, newElement){
	clearErrors();
	//var $newDiv = $("<div class = '"+divClass + "'>test</div>");
	if (element == undefined){
		return;
	}
	//check obj values;
	if  ((newElement.elementName === "" )  ) {
		//alert('Имя элемента незаполнено!');
		showError('Имя элемента незаполнено!');
		return;
	}
	//check for elements with id = newElement.elementName;
	if (!( $('#'+newElement.elementName).size() === 0)) {
		showError('Элемент с таким именем уже существует!');
		return;
	}
	//если тип незаполнен - устанавливаем text
	var type = (newElement.elementType == undefined)? 'text' : newElement.elementType; 
	
	var headElement = $(element);// элемент, к которому будем присоединять
	var addElement;//новый элемент ( div)
	headElement.append('<div class="'+newElement.className+'"id="'+newElement.elementName+'">'+newElement.elementName+'</div>');
	addElement = $('#'+elementName); 
	//добавляем поля наименования описания и типа
	$('<p><input class="input" type="text" value="" name="inputName'+newElement.elementName+'" placeholder="Заголовок"></p>').appendTo(addElement);
	$('<p><textarea class="textarea">'+newElement.elementDescription+'</textarea></p>').appendTo(addElement);
	//$('<p>type:'+type+'</p>').appendTo(addElement);
	//если тип - радио - добавляем строку для набора значений
	if (type == 'radio') {
			$('<p>type:'+type+'<input type="text" value="" name="radioValues'+newElement.elementName+'" placeholder="Значения перечисления"></p>').appendTo(addElement);
	}
	else{
			$('<p>type:'+type+'</p>').appendTo(addElement);
	}		
	//кнопка удаления
	$('<img src="images/btn-delete.gif" class="delete_div"></div>').appendTo(addElement);
	addElement.children('.delete_div').click(function(){
		var element = $(this).parents('.'+newElement.className);
		element.animate({ opacity: 'hide' },{duration: 'slow', complete:removeElement(element)});
	});
	
}
	
//добавить в строку ошибок новую строку
function showError(errString){
	var errDiv = $('.error');
	errDiv.toggleClass("active");
	$('<p>'+errString+'</p>').appendTo(errDiv);
	
}
//Функция для отчистки строки ошибок
function clearErrors(){
		$('.error').empty();
}
//удаление элемента
function removeElement(element){
		element.remove();
}
