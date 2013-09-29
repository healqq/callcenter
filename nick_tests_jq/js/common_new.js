//функция создает элемент в зависимости от полученного типа
/*
	type: div, p, h3, radio, text;
*/

function fabric ( type,  options) {
	//var mainElement = $(container);
	var newElement;
	var newElementType;
	var newElementId;
	//неправильно указан контейнер
	//if (mainElement.size() == 0) {
	//	return undefined;
	//}
	elementContent = '';
	//проверяем, что нет элемента с таким id
	newElementId =  options.id;
	if ( !(newElementId == undefined) ) {
		if ( !($('#'+options.id).size() == 0 ) ){
			return;
		}
	}
	//получаем данные, которые вставим внутрь элемента
	elementInnerData = (options.content == undefined)? "": options.content;
	switch ( type ) {
		case "div":
			elementContent = '<div>' + elementInnerData + '</div>'; break;
		case "p":
			elementContent = '<p>' + elementInnerData + '</p>'; break;
		case "h3":
			elementContent = '<h3>' + elementInnerData + '</h3>'; break;
		case "text area":
			elementContent = '<textarea placeholder="'+options.content+'"></textarea>'; break;
		case "text area edit":
			elementContent = '<textarea>'+options.content+'</textarea>'; break;	
		//options.content should be filled and type = array
		//
		case "radio":
			if ( ! $.isArray(options.content) || (options.name == undefined) ){
				//alert(typeof(options.content));
				return;
			};
			//elementInnerData = "";
			for (var i=0; i < options.content.length; i++ ){
				elementContent  += '<p><input type="radio" name ='+ options.name 
					+' value = ' + options.content[i] + '>'+options.content[i] + '</p>';
			}
			//elementContent = '<input type="radio">' + elementInnerData + '</input>'; 
			break;
		case "checkbox":
			break;
			
		case "text":
			elementContent = '<p><input type="text" placeholder="'+options.content+'"></p>';break;
		case "text edit":
			elementContent = '<p><input type="text" value ="'+options.content+'"></p>';break;
		case "button":
			elementContent = '<p><input type="button">'+options.content+'</input></p>';break;
		 default:
			return undefined;
			break;
	}
	//создаем элемент
	newElement = $(elementContent);
	//добавляем параметры
	if ( !(options.class == undefined) ) {
		newElement.attr("class", options.class);
	}
	
	if ( !(newElementId == undefined) ) {
		newElement.attr("id", options.id);
	}
	//newElement.appendTo(mainElement);
	return newElement;
}

//сворачивание/разворачивание при клике на заголовок
function onHeaderClick(){
	var that = $(this);
	that.siblings().slideToggle("slow");
	var div_block = that.parent("div");
	div_block.siblings().not(div_block).children().not("h3").slideUp("slow");
		
	that.toggleClass("active");
	that.siblings("h3").removeClass("active");
}
//событие при изменении инпута
//переходит на следующее сообщение, если такое есть.
//иначе просто сворачивает текущее	
function onTextChanged() {
	var div_block = $(this).parent("div");
	var new_div_block = div_block.next();
	if (new_div_block.size() == 0 ){
		//div_block.
		div_block.children().not("h3").slideUp("slow");
	}
	else{
		new_div_block.children("h3:first").trigger("click");
	}
}
//формирует структуру json по текущей структуре
/* {
		first: - первый див
		blocks: массив объектов contents для каждого блока.

*/
function exportToJSON(className){
	var divArray = [];
	
	
	var divSelection = $(className).children();
	var objectJSON = {first:divSelection.first().children("h3").text(), blocks:undefined};
	
	var objectDiv;
	
	
	var radioName = undefined;
	divSelection.each(function(){
		 divArray.push(createObjectFromDiv(this));
		
	});
	objectJSON.blocks = divArray; 
	return JSON.stringify(objectJSON);
}
function createObjectFromDiv(element){
	var pSelection;
	var radio = undefined;
	var input = undefined;
	var name, header, description, inputType, inputValues;
	id 				= $(element).attr("id");
	header 			= $(element).children("h3").text();
	pSelection 		= $(element).children("p");
	description 	= pSelection.first().text();
	inputSelection 	= $(element).find(':input');
	if (inputSelection.first().attr('type') == "textarea") {
		input = "Введите ответ:";
	}
	else{
		if (inputSelection.first().attr('type') == "radio"){
			radio = [];
			inputSelection.each(function(){
					radio.push($(this).val());
			});
		}
	}
	
	//if ( ! ($(this).find(':input[type=radio]',).size() == 0) ){
			
	//}
	objectDiv = {header:header, description:description,id:id,radio:radio,radioName:'radio'+id,input:input};
	return objectDiv;	
	
}
function importFromJSON(stringJSON, container)
{
	var objectJSON = JSON.parse(stringJSON);
	var newElement;
	var container = $(container);
	for (var i = 0; i < objectJSON.blocks.length; i++){
		createNewDivElement("show", objectJSON.blocks[i]).appendTo(container);
		
	}
	
	//var divArray = 
	
};

//описание классов и параметров для элементов
function getObjectSpecs(type,content,name){
var objectScpecs;
switch (type) {
		case "description":	objectSpecs = {class:undefined,content:content};break;
		case "header":		objectSpecs = {class:undefined,content:content};break;
		case "text area":	objectSpecs = {class:undefined,content:content,id:name};break;
		case "radio":		objectSpecs = {class:undefined,content:content,name:name};break;
		case "div":			objectSpecs = {class:undefined,id:name,content:undefined};break;
		case "editbutton":	objectSpecs = {class:"editbutton",content:content};break;
		default:
		return undefined;
		}
		return objectSpecs;
		
}
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
//создает новый блок 
//contents - объект, содержащий необходимые поля
//параметр type = show для создания блока для отображения
//если show не указано - то создается блок для редактирования
function createNewDivElement(type, contents){
	switch (type){
	case "show":
		newElement 		= fabric("div", 		getObjectSpecs("div",undefined,contents.id));
		newHeader 		= fabric("h3", 			getObjectSpecs("header",contents.header)); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		newButton 		= fabric("button",  	getObjectSpecs("editbutton"	,"edit"));
		
		
		
		newHeader.appendTo( newElement );
		newHeader.click( onHeaderClick );
		
		newParagraph.appendTo( newElement );
		
		if ( !(contents.input == undefined) ){
			newInput		= fabric("text area",  	getObjectSpecs("text area",contents.input)); 
			newInput.appendTo( newElement );
			newInput.change(onTextChanged);
		}
		
		if ( !(contents.radio == undefined) && !(contents.radioName == undefined) ){
			newRadio		= fabric("radio",  		getObjectSpecs("radio",contents.radio,contents.radioName));
			newRadio.appendTo( newElement );
		}
		//кнопка редактирования
		newButton.children(':input').click(onEditClick);
		newButton.appendTo( newElement);
	break;
	//заполняем поля значениями, которые были
	case "edit":
			newElement 		= fabric("div", 			getObjectSpecs("div",undefined,contents.id) );
			newHeader 		= fabric("text edit", 		getObjectSpecs("text area", contents.header) );
			newParagraph    = fabric("text area edit", 	getObjectSpecs("text area", contents.description) );
			newInput    	= fabric("radio"	, 		getObjectSpecs("radio", contents.radio,contents.radioName) );
			newInputRadio   = fabric("text"	    , 		getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newPosition   	= fabric("text edit", 		getObjectSpecs("text area", contents.position ,"position" ) );
			newHeader.appendTo( newElement );
			//newHeader.children(':input').val(contents.header);
			newParagraph.appendTo( newElement );
			//newParagraph.val(contents.description);
			newInput.appendTo ( newElement );
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();	
			//newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
	break;
	//создаем новый temp_div
	default:
			newElement 		= fabric("div", 		getObjectSpecs("div",undefined,contents.id) );
			newHeader 		= fabric("text", 		getObjectSpecs("text area", contents.header) );
			newParagraph    = fabric("text area", 	getObjectSpecs("text area", contents.description) );
			newInput    	= fabric("radio"	, 	getObjectSpecs("radio", contents.radio,contents.radioName) );
			newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newPosition   	= fabric("text"	    , 	getObjectSpecs("text area", undefined ,"position" ) );
			
			newHeader.appendTo( newElement );
			newParagraph.appendTo( newElement );
			newInput.appendTo ( newElement );
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();	
			newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			
	}
	return newElement;
}
//создает элемент временный 
function createNewTempElement(contents){
	var edit = true;
	if (contents == undefined){
		var contents = {
			id: undefined,
			header:"Введите заголовок блока",
			description:"И его описание",
			radio: ["text","radio"],
			radioName: "inputType",
			input: "Im just some text"
			};
		edit = false;
		}
	$('#temp_divs').empty();
	newElement = createNewDivElement(edit?"edit":undefined,contents);
	newElement.appendTo( $('#temp_divs') );
	$('input[name=' + 'inputType' + ']','#temp_divs').change(function()	{
		if ($(this).val() == "radio"){
			$("#radioOptions", '#temp_divs').show();
			
		}
		else{
			$("#radioOptions", '#temp_divs').hide();
		}
	});
}
//добавляет элемент из temp_div в конец основного контейнера и очищает поля в temp_div
function addElement(){
	clearErrors();
	
	var name = $('#newElementName').val();
	if (name == ""){
		showError("Имя блока должно быть заполнено!");
		return;
	}
	var thisDiv = $("#temp_divs").children().first();
	var input = undefined;
	var radio = undefined;
	//var position = undefined;
	var position = thisDiv.children('#position').children(':input').val();
	var inputType = $('input[name=' + 'inputType' + ']:checked','#temp_divs');
	if (inputType.length == 0) {
		showError("Не выбран тип ввода информации");
		return;
	}
	
	if ( inputType.val() == "text" ){
			input = "";
	}
	else{
		radio = $("#radioOptions", '#temp_divs').children('input[type=text]').val().split(',');
		if ( radio.length < 2 ){
			showError("Для переключателя нужно указать как минимум два значения!");
			return;
		}
	}
		
				
	var contents ={
		id: name,
		header:thisDiv.children('p').children(':input[type=text]').val(),
		description:thisDiv.children('textarea').val(),
		radio: radio,
		radioName: "radio"+name,
		input: input
	};
	thisDiv.remove();
	newDiv = createNewDivElement("show",contents);
	if (position === "") {
		newDiv.appendTo( $("#container") );
	}
	else{
		if (position == 0) {
			newDiv.prependTo( $("#container") );
		}
		else{
			newDiv.insertAfter($("#container").children(':nth-child('+position+')') );
		}
	}
	createNewTempElement(); //обнуляем значения у temp_div
}
function onEditClick()
{
var position;
	var parentBlock = $(this).parent().parent('div');
	//	var previousBlock = parentBlock.prevAll('div:first');
		//if (previousBlock.length == 0){
			//	position = 0;
		//}
		//else{
	position = parentBlock.index();
	objectDiv = createObjectFromDiv(parentBlock);
	objectDiv.position = position;
	parentBlock.animate({opacity: 'hide',height:0+'px'},{duration:'slow',easing: 'swing',complete:function(){
		removeElement(parentBlock);
		}
	});
	//removeElement(parentBlock);
	$('#newElementName').val(objectDiv.id);
	objectDiv.id = undefined;
	objectDiv.radio = ["text","radio"];
	objectDiv.radioName = "inputType";
	createNewTempElement(objectDiv);
}