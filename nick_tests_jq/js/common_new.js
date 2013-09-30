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
			showError("Элемент с таким id уже существует!");
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
					+' value ="' + i + '"id ='+options.name+i+'><label for='+options.name+i+'>'+options.content[i]+'</label></p>';
			}
			//elementContent = '<input type="radio">' + elementInnerData + '</input>'; 
			break;
		case "checkbox":
			elementContent = '<p><input type="checkbox">'+options.content+'</p>';
			break;
			
		case "text":
			elementContent = '<p><input type="text" placeholder="'+options.content+'"></p>';break;
		case "textinline":
			elementContent = '<input type="text" placeholder="'+options.content+'">';break;
		case "textinline edit":
			elementContent = '<input type="text" value="'+options.content+'">';break;
		case "text edit":
			elementContent = '<p><input type="text" value ="'+options.content+'"></p>';break;
		case "button":
			elementContent = '<p><input type="button" value='+options.content+'></input></p>';break;
		case "buttoninline":
			elementContent = '<input type="button" value='+options.content+'></input>';break;
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
	allDivBlocks = div_block.siblings().not(div_block);
	allDivBlocks.children().not("h3").slideUp("slow");
		
	that.addClass("active");
	allDivBlocks.children('h3').each(function(){
		$(this).removeClass("active");
		});
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
	var branchesList = undefined;
	var name, header, description, inputType, inputValues;
	branchesList = $(element).data("branches");
	id 				= $(element).attr("id");
	header 			= $(element).children("h3").text();
	pSelection 		= $(element).children("p");
	description 	= pSelection.first().text();
	inputSelection 	= $(element).find(':input[type=radio]');
	textAreaSelection = $(element).find('textarea');
	var inputType = undefined;
	
	if (textAreaSelection.length > 0) {
		input = "Введите ответ:";
		inputType = "text";
	}
	
	if (inputSelection.length > 0){
		radio = [];
		inputType = "radio";
		inputSelection.each(function(){
				radio.push($('label[for='+$(this).attr('id')+']').text());
		});
	}
		
		
	//if ( ! ($(this).find(':input[type=radio]',).size() == 0) ){
			
	//}
	objectDiv = {header:header, description:description,id:id,radio:radio,radioName:'radio'+id,input:input,inputType:inputType,branches:branchesList};
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
		case "description":				objectSpecs = {class:undefined,content:content};break;
		case "header":					objectSpecs = {class:undefined,content:content};break;
		case "text area":				objectSpecs = {class:undefined,content:content,id:name};break;
		case "radioInputTypes":			objectSpecs = {class:undefined,content:["text","radio"],name:"inputType"};break;
		case "radio":					objectSpecs = {class:undefined,content:content,name:name};break;
		case "div":						objectSpecs = {class:undefined,id:name,content:undefined};break;
		case "editbutton":				objectSpecs = {class:"editbutton",content:content};break;
		case "removebutton":			objectSpecs = {class:"removebutton",content:content};break;
		case "addbutton":				objectSpecs = {class:"addbutton",content:content};break;
		case "checkboxBranch":			objectSpecs = {class:undefined,content:"Ветвление",id:"branch"};break;
		case "radioOptionText": 		objectSpecs = {class:"radioOption",content:"Введите значение",id:undefined};break;
		case "radioOptionText edit": 	objectSpecs = {class:"radioOption",content:content,id:undefined};break;
		case "nextElementText": 		objectSpecs = {class:"branchId",content:"Введите id элемента",id:undefined};break;
		case "nextElementText edit":	objectSpecs = {class:"branchId",content:content,id:undefined};break;
		default:
		return undefined;
		}
		return objectSpecs;
		
}
function showError(errString){
	var errDiv = $('.error');
	errDiv.addClass("active");
	$('<p>'+errString+'</p>').appendTo(errDiv);
	
}
//Функция для отчистки строки ошибок
function clearErrors(){
		$('.error').empty();
		$('.error').removeClass("active");
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
		newElement.data("branches", contents.branches);
		newHeader 		= fabric("h3", 			getObjectSpecs("header",contents.header)); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		newButton 		= fabric("button",  	getObjectSpecs("editbutton"	,"edit"));
		
		
		
		newHeader.appendTo( newElement );
		newHeader.click( onHeaderClick );
		
		newParagraph.appendTo( newElement );
		if (contents.inputType == "radio"){
			if ( !(contents.radio == undefined) && !(contents.radioName == undefined) ){
			newRadio		= fabric("radio",  		getObjectSpecs("radio",contents.radio,contents.radioName));
			newRadio.appendTo( newElement );
			}
		}
		else{
			//if ( !(contents.input == undefined) ){
				newInput		= fabric("text area",  	getObjectSpecs("text area",contents.input)); 
				newInput.appendTo( newElement );
				newInput.change(onTextChanged);
			//}
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
			newInput    	= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newIsSwitch   	= fabric("checkbox" , 		getObjectSpecs("checkboxBranch") );
			//newInputRadio   = fabric("text edit", 		getObjectSpecs("text area", contents.radio, "radioOptions") );
			newInputRadio   = createRadioOptionsList(contents.radio, contents.branches);
			newPosition   	= fabric("text edit", 		getObjectSpecs("text area", contents.position ,"position" ) );
			
			newHeader.appendTo( newElement );
			//newHeader.children(':input').val(contents.header);
			newParagraph.appendTo( newElement );
			//newParagraph.val(contents.description);
			newInput.appendTo ( newElement );
			newInputRadio.appendTo ( newElement );
			
			
			
			if (contents.inputType == "radio"){
				newInput.find(':input[value="1"]').prop('checked',true);
			}
			else{
				if (contents.inputType == "text"){
			
				newInput.find(':input[value="0"]').prop('checked',true);
				newInputRadio.hide();
				}
			}
			
				
			//newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			newIsSwitch.appendTo( newElement );
			newIsSwitch.children(':input').click(onBranchClick);
			if (contents.branches == undefined ){
				newIsSwitch.children(":input").prop('checked', false);
			}
			else{
				newIsSwitch.children(":input").prop('checked', true);
			}
	break;
	//создаем новый temp_div
	default:
			newElement 		= fabric("div", 		getObjectSpecs("div",undefined,contents.id) );
			newHeader 		= fabric("text", 		getObjectSpecs("text area", contents.header) );
			newParagraph    = fabric("text area", 	getObjectSpecs("text area", contents.description) );
			newInput    	= fabric("radio"	, 	getObjectSpecs("radioInputTypes") );
			newIsSwitch   	= fabric("checkbox" , 	getObjectSpecs("checkboxBranch") );
			//newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newInputRadio   = createRadioOptionsList();
			newPosition   	= fabric("text"	    , 	getObjectSpecs("text area", undefined ,"position" ) );
			
			
			newHeader.appendTo( newElement );
			newParagraph.appendTo( newElement );
			newInput.appendTo ( newElement );
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();	
			newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			newIsSwitch.appendTo( newElement );
			newIsSwitch.children(':input').click(onBranchClick);
			
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
			radio: undefined,
			radioName: undefined,
			input: "Im just some text",
			inputType:  undefined,
			branches: undefined
			};
		edit = false;
		}
	$('#temp_divs').empty();
	newElement = createNewDivElement(edit?"edit":undefined,contents);
	newElement.appendTo( $('#temp_divs') );
		$('input[name=inputType]','#temp_divs').change(function()	{
			if ($('label[for='+$(this).attr('id')+']').text() == "radio"){
				$("#radioOptions", '#temp_divs').slideDown("slow");
				
			}
			else{
			if ($('label[for='+$(this).attr('id')+']').text() == "text"){
				$("#radioOptions", '#temp_divs').slideUp("slow");
				}
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
	if ($(":input","#branch").is(":checked")){
		branches = [];
		$(".branchId").each(function(){
			branches.push($(this).val());
		});
	}
	else{
		branches = undefined;
	}
	//var position = undefined;
	var position = thisDiv.children('#position').children(':input').val();
	var inputType = $('input[name=' + 'inputType' + ']:checked','#temp_divs');
	if (inputType.length == 0) {
		showError("Не выбран тип ввода информации");
		return;
	}
	
	if ( inputType.val() == "0" ){
			input = "";
			inputTypeVal = "text";
	}
	else{


		inputTypeVal = "radio";
		radio = [];
		radioOptionsList = $(':input[type=text]','.radioOption').not('.branchId');
		radioOptionsFilled = radioOptionsList;
		radioOptionsList.each(function(){
			if ($(this).val() == "" ){
				radioOptionsFilled = radioOptionsFilled.not(this);
			}
		});
		
		if ( radioOptionsFilled.length < 2 ){
			showError("Для переключателя нужно указать как минимум два значения!");
			return;
		}
		radioOptionsFilled.each(function(){
			radio.push($(this).val());
		});

	}	
				
	var contents ={
		id: name,
		header:thisDiv.children('p').children(':input[type=text]').val(),
		description:thisDiv.children('textarea').val(),
		radio: radio,
		radioName: "radio"+name,
		input: input,
		inputType: inputTypeVal,
		branches: branches
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
	$('#newElementName').val("");
}
function onEditClick(){
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
	//objectDiv.radio = ["text","radio"];
	//objectDiv.radioName = "inputType";
	createNewTempElement(objectDiv);
}
//если есть ветвление - то тип по дефолту радио
function onBranchClick(){
	if ($(this).is(':checked') ) {
		$(':input[name=inputType][value=1]').prop('checked',true);
		$("#radioOptions", '#temp_divs').slideDown("slow");
		$(':input[name=inputType]').parent().slideUp("slow");
		$('.branchId').slideToggle("slow");
	}
	else{
		//$(':input[name=inputType][value=radio]').attr('checked',"checked");
		//$("#radioOptions", '#temp_divs').hide();
		//$(':input[name=inputType][value=radio]').attr('checked',undefined)
		$(':input[name=inputType]').parent().slideToggle("slow");
		$('.branchId').slideUp("slow");
	}
		
	
}
//список для radio в созаднии элемента
function createRadioOptionsList( optionsList, branchesList ){
	newRadioOptions 	= fabric("div"	    , 	getObjectSpecs("div", undefined ,"radioOptions" ) );
	newRadioOptionsAdd 	= fabric("button", getObjectSpecs("addbutton","add") );
	newRadioOptionsAdd.click(addRadioOptionsListItem);
	newRadioOptionsAdd.appendTo(newRadioOptions);
	if (optionsList == undefined ){
		// для нового элемента
		newOption1 				= fabric("text",	 		getObjectSpecs("radioOptionText" ) );
		newOption1NextElement	= fabric("textinline", 		getObjectSpecs("nextElementText" ) );
		newOption1Remove  		= fabric("buttoninline",	getObjectSpecs("removebutton", "remove") );
		newOption2 				= fabric("text"	    , 		getObjectSpecs("radioOptionText" ) );
		newOption2NextElement	= fabric("textinline",		getObjectSpecs("nextElementText" ) );
		newOption2Remove  		= fabric("buttoninline",	getObjectSpecs("removebutton", "remove") );
		newOption1Remove.click(removeRadioOptionsListItem);
		newOption2Remove.click(removeRadioOptionsListItem);
		newOption1Remove.insertAfter(newOption1.children(":first"));
		newOption1NextElement.insertAfter(newOption1.children('input[type=button]'));
		newOption1.appendTo(newRadioOptions);
		newOption2Remove.insertAfter(newOption2.children(":first"));
		newOption2NextElement.insertAfter(newOption2.children('input[type=button]'));
		newOption2.appendTo(newRadioOptions);
		
		if ($(":input","#branch").is(":checked") ){
			newOption1NextElement.show();
			newOption2NextElement.show();
		}
		else{
			newOption1NextElement.hide();
			newOption2NextElement.hide();
		}
		
		
		
	}
	else{
		//для edit'а текущего
		
		for (var i = 0; i < optionsList.length; i++ ){
			newOption 				= fabric("text edit", 				getObjectSpecs("radioOptionText edit", optionsList[i]  ) );
			newOptionRemove  		= fabric("buttoninline",   			getObjectSpecs("removebutton", "remove") );
			newOptionNextElement	= fabric("textinline edit", 		getObjectSpecs("nextElementText edit",branchesList == undefined? "":branchesList[i] ) );
			newOptionRemove.click(removeRadioOptionsListItem);
			newOptionRemove.insertAfter(newOption.children(":first"));
			newOptionNextElement.insertAfter(newOption.children('input[type=button]'));
			newOption.appendTo(newRadioOptions);
			if ( branchesList == undefined ){
				newOptionNextElement.hide();
				
			}
			else{
				
				newOptionNextElement.show();
				
			}
			
		}
	}
	return newRadioOptions;
}
//добавляет в список ещё одно поле
function addRadioOptionsListItem(){
		newOption 				= fabric("text"	    	, 	getObjectSpecs("radioOptionText" ) );
		newOptionRemove  		= fabric("buttoninline",   getObjectSpecs("removebutton", "remove") );
		newOptionNextElement	= fabric("textinline", 		getObjectSpecs("nextElementText") );
		newOptionNextElement.insertAfter(newOption1.children('input[type=button]'));
		newOptionRemove.click(removeRadioOptionsListItem);
		newOptionRemove.insertAfter(newOption.children(":first"));
		newOptionNextElement.insertAfter(newOption.children('input[type=button]'));
		newOption.hide();
		newOption.appendTo($("#radioOptions"));
		if ($(":input","#branch").is(':checked') ){
			newOptionNextElement.show();
		}
		else{
			newOptionNextElement.hide();
		}
		newOption.slideToggle("slow");
}	
function removeRadioOptionsListItem(){
		element = $(this).parent("p");
		element.animate({height:0, opacity:'hide'},{duraiton:"slow", complete:function(){
			removeElement($(this));
			}	
		});
		//element = $(this).parent("p").remove();
}
		
