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
		if ( !($('#+options.id').size() == 0 ) ){
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
		//options.content should be filled and type = array
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
function exportToJSON(className){
	var divArray = [];
	
	
	var divSelection = $(className).children();
	var objectJSON = {first:divSelection.first().children("h3").text(), blocks:undefined};
	var divArray = [];
	
	
	var radioName = undefined;
	divSelection.each(function(){
		var pSelection;
		var radio = undefined;
		var input = undefined;
		var name, header, description, inputType, inputValues;
		id 				= $(this).attr("id");
		header 			= $(this).children("h3").text();
		pSelection 		= $(this).children("p");
		description 	= pSelection.first().text();
		inputSelection 	= $(this).find(':input');
		if (inputSelection.type == "text") {
			input = "";
		}
		else{
			if (inputSelection.type == "radio"){
				radio = [];
				inputSelection.each(function(){
						radio.push($(this).text());
				});
			}
		}
		
		//if ( ! ($(this).find(':input[type=radio]',).size() == 0) ){
			
		//}
		objectDiv = {header:header, description:description,id:id,radio:radio,radioName:'radio'+id,input:input};
		divArray.push(objectDiv);
	});
	//for (var i = 0; i < divSelection.length; i++ ){
	//	header 			= divSelection[i].children("h3").text();
	//	pSelection 	= divSelection[i].children("p");
	//	decription 		= pSelection.first().text();
	//	inputType 		= p_selection.next().text;
	
	objectJSON.blocks = divArray; 
	return JSON.stringify(objectJSON);
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
		default:
		return undefinded;
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
function createNewDivElement(type, contents){
	if (type == "show"){
		newElement 		= fabric("div", 		getObjectSpecs("div",undefined,contents.id));
		newHeader 		= fabric("h3", 			getObjectSpecs("header",contents.header)); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		
		
		
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
	}
	else{
			newElement 		= fabric("div", 		getObjectSpecs("div",undefined,contents.id) );
			newHeader 		= fabric("text", 		getObjectSpecs("text area", contents.header) );
			newParagraph    = fabric("text area", 	getObjectSpecs("text area", contents.description) );
			newInput    	= fabric("radio"	, 	getObjectSpecs("radio", contents.radio,contents.radioName) );
			newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			
			newHeader.appendTo( newElement );
			newParagraph.appendTo( newElement );
			newInput.appendTo ( newElement );
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();	
			
	}
	return newElement;
}

function createNewTempElement(){
	var contents = {
		id: undefined,
		header:"Введите заголовок блока",
		description:"И его описание",
		radio: ["text","radio"],
		radioName: "inputType",
		input: "Im just some text"
		};
	newElement = createNewDivElement(undefined,contents);
	newElement.appendTo( $('#temp_divs') );
}