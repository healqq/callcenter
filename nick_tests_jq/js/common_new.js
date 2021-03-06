﻿//функция создает элемент в зависимости от полученного типа
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

			model.getInstance().api.showError("Элемент с таким id уже существует!", "#newElementName");
			// throw new exeption;
			return;

		}
	}
	//получаем данные, которые вставим внутрь элемента
	elementInnerData = (options.content == undefined)? "": options.content;
	switch ( type ) {
		case "br":
			elementContent = '<br>'; break;
		case "span":
			elementContent = '<span>'+ elementInnerData +'</span>'; break;
		case "a":
			elementContent = '<a></a>'; break;
		case "h5":
			elementContent = '<h5></h5>'; break;
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
		case "radio-line":
			if ( ! $.isArray(options.content) || (options.name == undefined) ){
				//alert(typeof(options.content));
				return;
			};
			//elementInnerData = "";
			for (var i=0; i < options.content.length; i++ ){
				elementContent  += '<input type="radio" name ='+ options.name 
					+' value ="' + i + '"id ='+options.name+i+'><label for='+options.name+i+'>'+options.content[i]+'</label>';
			}
			//elementContent = '<input type="radio">' + elementInnerData + '</input>'; 
			break;
		case "checkbox":
			elementContent = '<input type="checkbox" >';break;
		case "label":
			elementContent = '<label for="'+options.id+'">'+options.content+'</label>';break;
			
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
		case "buttoninlinetooltip":
			elementContent = '<input type="button" title='+options.content+'></input>';break;
		case "hidden":
			elementContent = '<input type="hidden">';break;
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
	
	if ( !(type == "label") && !(newElementId == undefined) )  {
		newElement.attr("id", options.id);
	}
	//newElement.appendTo(mainElement);
	return newElement;
}

//сворачивание/разворачивание при клике на заголовок
function onHeaderClick(evt, elem, state){
	//var that = $(this);
	
	/*if (evt.originalEvent === undefined){
		console.log('heder-click-text-changed');
	}
	else{
		console.log('heder-click-click');
	}*/
	/*console.table(evt);*/
	/*var fixedState  = ( (state === undefined) ? this : elem );*/
	var that  = ( (elem === undefined) ? this : elem );
	
	if ( state === $(that).hasClass('active_header') ){
		return;
	}
	var div_block = $(that).parent("div");
	var allDivBlocks = div_block.siblings().not(div_block);	
	$(that).toggleClass("active_header");
	
	
	allDivBlocks.children('h3').each(function(){
		$(this).removeClass("active_header");
			divBlock = $(this).parent('div');
			if (!$('#container').data("sstype")){
				markHeaders(divBlock);
			}
		});
	$('#imported').children().each( function(){
		$(this).find('h3').removeClass('active_header');
	});
	if (allDivBlocks.length === 0)
		$(that).siblings().slideToggle({duration:400});
	else{
		
		var myEvent = function(){
			allDivBlocks.children().not("h3").animate({height:"hide",opacity:"hide"},{duration:400});
		};
		$.when(myEvent() ).done(function(){
			$(that).siblings().slideToggle({duration:400});
			//setting additional info
			
			model.getInstance().refreshAdditionalDescription(div_block, !$(that).hasClass('active_header'));
			
			//clearing additional info
			
		});
		
		
			
		
	}
	//$(this).siblings().slideToggle({duration:"slow"});
	/*$(this).dequeue( "toggle-queue" );*/
	
		
		
		
	
	//div_block.find("textarea").focus();
	if ( ! $(that).hasClass('active_header') ){
		if (!$('#container').data("sstype")){
				markHeaders(div_block);
			}
		
	}
	else{
		$(that).removeClass('not-filled');
	}
	
	redraw();
	//var values = getInputValue(div_block);
	var objElement = model.getInstance().blockActions.getElement( div_block.attr('id')) ;
	/*if ( values[values.length-1].val() !== '' ) */
	if ( 
		( 
			( ( objElement.branches === undefined) /*&& ( objElement.branches.length === 1 ) )*/)
			||
			( objElement.branches.length > 1) && (!model.getInstance().blockActions.hasBranches( objElement.branches ) ) 
		) 
	&& 
		( $('#submit-block').css('display') == 'none' ) 
	){
		
		fillSummaryBlock();
		showSubmitBlock();
		
	}
	//setTimeout(controller.getInstance().addEvent($(that), 'click', onHeaderClick ), 3000);
	/*if (that === $('#container').children(":last")[0]){
		showSubmitBlock();
	}*/
}
function markHeaders(element){
	var divObject = model.getInstance().blockActions.getElement( $(element).attr('id'), true );//createObjectFromDiv(element);
	var state = 'filled';
	switch (divObject.inputType) {
		case "text": textSelection   = $(element).find(":input[type=text]");
					//for (var i=0; i< 
					textSelection.each(function(index, value){
						if ( $(this).val().trim() == "")
							state = "warning";
						});
		break;
		case "radio": radioSelection   = $(element).find(":input[type=radio]:checked");
					if (radioSelection.length == 0 )
							state = "warning";
		break;
		case "textarea": textAreaSelection   = $(element).find("textarea");
					if (textAreaSelection.val().trim() == "" )
							state = "warning";
		break;
		
		
	}
	if (state == "warning"){
		$(element).children('h3').addClass("not-filled");
	}
	else{
		$(element).children('h3').removeClass("not-filled");
	}
}
	

//событие при изменении инпута
//переходит на следующее сообщение, если такое есть.
//иначе просто сворачивает текущее	
function onTextChanged(evt) {
	//console.log('text-change');
	//var element =( (item === undefined)?this: item );
	var element = evt.currentTarget;
	var divBlock = $(element).parents(".divacc");
	
	addSavedData(divBlock);
	var nextDivBlock = divBlock.next();
	if (nextDivBlock.size() == 0 ){
		//div_block.
		onHeaderClick(undefined,divBlock.children("h3:first"));
		showSubmitBlock();
		view.getInstance().focusElement('#btnSendData');
	}
	else{
		//controller.getInstance().clearEvents(nextDivBlock.children("h3:first"));
	//	nextDivBlock.children("h3:first").trigger('click');
		
		onHeaderClick(undefined, nextDivBlock.children("h3:first"), true);
		
		
	}
	focusOnInput(nextDivBlock);
	clearSummaryBlock();
	fillSummaryBlock();
	
	
}
//sets focus on input
//timeout added cuz focus fires twice on enter event (?webkit bug?)
function focusOnInput(element){
	var textareaSelect = element.find("textarea");
	if (textareaSelect.length == 0 ){
		setTimeout(function(){element.find("input[type=text]:first").focus()}, 50);
			
	}
	else{
		setTimeout(function(){textareaSelect.focus()}, 50);
		
	}
}
//формирует структуру json по текущей структуре
/* {
		first: - первый див
		blocks: массив объектов contents для каждого блока.

*/
function exportToJSON(idNames){
	var divArray = [];
	var objectJSON = {first:undefined, blocks:undefined};
	for (var i=0 ; i < idNames.length; i++){
		var divSelection = $(idNames[i]).children();
		if (i == 0) {
			first = divSelection.first().attr('id');
		}
		
		//var objectDiv;
		
		
		var radioName = undefined;
		divSelection.each(function(){
			 divArray.push(model.getInstance().blockActions.getElement($(this).attr('id'), true) );
			
		});
		 
	}
	objectJSON.blocks = divArray;
	objectJSON.first  = first;
	objectJSON.sync   = model.getInstance().api.getSyncMap();
	return JSON.stringify(objectJSON);
}

//not used
function createObjectFromDiv(element, noConvert){
	noConvert = ( (noConvert == undefined)? true: noConvert);
	var pSelection;
	var radio = undefined;
	var input = undefined;
	var fieldsList = undefined;
	var branchesList = undefined;
	var name, header, description, inputType, inputValues;
	branchesList = $(element).data("branches");
	id 				= $(element).attr("id");
//	branchesList    = 
	header 			= $(element).children("h3").children().not(".idSpan").text();
	pSelection 		= $(element).children("p");
	description 	= (noConvert ? pSelection.first().html() : bbCodeParserSingleton.getInstance().htmlToBB(pSelection.first().html()) );
	inputSelection 	= $(element).find(':input[type=radio]');
	textAreaSelection = $(element).find('textarea');
	textSelection   = $(element).find(":input[type=text]");
	//inputFieldsCount = textSelection.length || undefined;
	var inputType = undefined;
	
	if (textAreaSelection.length > 0) {
		input = "Введите ответ:";
		inputType = "textarea";
	}
	
	if (inputSelection.length > 0){
		radio = [];
		inputType = "radio";
		inputSelection.each(function(){
				radio.push($('label[for='+$(this).attr('id')+']').text());
		});
	}
	
	if (textSelection.length > 0){
		fieldsList = [];
		inputType = "text";
		textSelection.each(function(){
				fieldsList.push({value: $(this).prop("placeholder"),
				required: model.getInstance().validation.isRequired( $(this) )
				});
			});
		
		
	}
		
		
	//if ( ! ($(this).find(':input[type=radio]',).size() == 0) ){
			
	//}
	objectDiv = {header:header, 
		description:description,
		id:id,
		radio:radio,
		radioName:'radio'+id,
		input:input,
		inputType:inputType,
		branches:branchesList,
		fieldsList:fieldsList };
	return objectDiv;	
	
}
function importFromJSON(stringJSON, container, isEdited)
{
	isEdited = (isEdited == undefined ? false : isEdited);
	var objectJSON = JSON.parse(stringJSON);
	var newElement;
	var scriptStructure = {};
	var container = $(container);
	//очищаем контейнеры
	$("#container").empty();
	$('#imported').empty();
	var isFirstElement = false;
	var firstElement = undefined;
	//если загружена пустая структура
	if (objectJSON.blocks.length !== 0 ){
		for (var i = 0; i < objectJSON.blocks.length; i++){
			
			//для стыковки со старой версией структуры
			if ( objectJSON.blocks[i].additionalDescription === undefined){
				objectJSON.blocks[i].additionalDescription = '';
			}
			scriptStructure[objectJSON.blocks[i].id] = objectJSON.blocks[i];
			if (objectJSON.blocks[i].id == objectJSON.first){
				isFirstElement = true;
			}
			objectJSON.blocks[i].description = bbCodeParserSingleton.getInstance().bbToHTML(objectJSON.blocks[i].description);
			if (objectJSON.blocks[i].fieldsList !== undefined){
				if (objectJSON.blocks[i].fieldsList[0].value === undefined) {
					var tempArray = objectJSON.blocks[i].fieldsList;
					objectJSON.blocks[i].fieldsList = [];
					for (var j = 0; j < tempArray.length; j++){
						objectJSON.blocks[i].fieldsList.push({value:tempArray[j],
							required: false
						});
					}
					
				}
			}
			view.getInstance().buttonsAnimation(createNewDivElement(
			"show", objectJSON.blocks[i], isEdited, isFirstElement).appendTo(container));
			isFirstElement = false;
			
		}
		if (objectJSON.sync !== undefined){
			model.getInstance().api.setSyncMap( objectJSON.sync);
		}
		model.getInstance().blockActions.setStructure( scriptStructure, objectJSON.first);
		firstElement = objectJSON.first;
	}
	else{
		
	}
	return firstElement;
	//var divArray = 
	
}

//описание классов и параметров для элементов
function getObjectSpecs(type,content,name){
var objectScpecs;
switch (type) {
		//basic
		case "br": 						objectSpecs = {class:undefined,content:undefined, id:undefined};break;
		case "p":						objectSpecs = {class:undefined,id:name,content:content};break;
		case "div":						objectSpecs = {class:undefined,id:name,content:undefined};break;
		//element name
		case "elementName":				objectSpecs = {class:undefined,content:content,id:'newElementName'};break;
		//temp-div
		case "addElementButton":		objectSpecs = {class:"control-button",content:"Добавить элемент",id:'add_div'};break;
		case "addElementButtonP": 		objectSpecs = {class:"addbuttonP",content:undefined,id:undefined};break;
		case "temp-div-header":			objectSpecs = {class:"temp-div-header",content:content};break;
	//	case "radioOptionP": 			objectSpecs = {class:"radioOption"};break;
		case "radioInputTypes":			objectSpecs = {class:undefined,content:["Многострочное поле","Выбор из нескольких элементов","Однострочные поля"],name:"inputType"};break;
		case "radio":					objectSpecs = {class:'radio-block',content:content,name:name};break;
		case "text area":				objectSpecs = {class:"textarea",content:content,id:name};break;
		case "description":				objectSpecs = {class:"description",content:content};break;
	//	case "description":				objectSpecs = {class:"additional-description",content:content};break;
		case "header":					objectSpecs = {class:"header",content:content};break;
		case "radioOptionP": 			objectSpecs = {class:"radioОption"};break;
		case "radioInputTypes":			objectSpecs = {class:undefined,content:["Многострочное поле","Выбор из нескольких элементов","Однострочные поля"],name:"inputType"};break;
		case "radio":					objectSpecs = {class:undefined,content:content,name:name};break;
		case "temp-title":				objectSpecs = {class:"title",content:content,id:'temp-title'};break;
		case "bb-block":				objectSpecs = {class:'bb-block',content:content};break;
		case "bb-button":				objectSpecs = {class:'line-button',content:content,id:name};break;
		case "colorpicker":				objectSpecs = {class:'colorpicker',content:content,id:name};break;
		case 'blockname-block':			objectSpecs = {class:undefined,content:undefined,id:'blockname-block'};break;
		case 'elementNameAutofill':		objectSpecs = {class:'checkBox',content:'Автозаполнение', id:'elementNameAutofill'};break;
		case 'elementNameAutofillLabel':objectSpecs = {class:'checkBoxLabel ',content:'Автозаполнение', id:'elementNameAutofill'};break;
		case 'elementRequired':			objectSpecs = {class:'checkBox ',content:'Обязательный', id:name};break;
		case 'elementRequiredLabelAll':	objectSpecs = {class:'checkBoxLabel ',content:'Обязательный', id:name};break;
		case 'elementRequiredLabel':	objectSpecs = {class:'checkBoxLabel req-chbox',content:'Обязательный', id:name};break;
		case 'add-block':				objectSpecs = {class:'add-block', content: undefined, id: undefined};break;
		case 'add-block-button':		objectSpecs = {class:'addbuttonP add-block',content: undefined, id: undefined};break;
		case 'add-block-position__div':	objectSpecs = {class:'add-block-position__div', content: undefined, id: undefined};break;
		case 'add-block-position__radio': objectSpecs = {class:'position-type',content:["В конец","В начало","После элемента"],name:"positionType"};break;
		case 'additional-info-toggle': 	objectSpecs ={class: 'link-button', content:'Дополнительная информация', id:'add-info-toggle'};break;
		//show
		case "accordiontextarea":		objectSpecs = {class:"accordiontextarea",content:content,id:name};break;
		case "textfield":				objectSpecs = {class:"accordiontext",content:content,id:name};break;	
		case "headerAccordion":			objectSpecs = {class:"accordionheader",content:content};break;
		case "divacc":					objectSpecs = {class:"divacc",id:name,content:undefined};break;
		case "editbutton":				objectSpecs = {class:"editbutton",content:content};break;
		case "removebutton":			objectSpecs = {class:"removebutton",content:'"Удалить элемент"'};break;
		case "addbutton":				objectSpecs = {class:"editbutton",content:'"Добавить ещё элемент"'};break;
		case "input-block":				objectSpecs = {class:"input-block",id:undefined,content:undefined};break;
		//checkbox
		case "branchP":					objectSpecs = {class:undefined,content:undefined,id:"branch-block"};break;
		case "reqP":					objectSpecs = {class:undefined,content:undefined,id:"req-block"};break;
		case "checkboxBranch":			objectSpecs = {class:'checkBox',content:"Ветвление",id:"branch"};break;
		case "checkboxBranchLabel":		objectSpecs = {class:'checkBoxLabel',content:"Ветвление",id:"branch"};break;
		//radio options
		case "radioOptionP": 			objectSpecs = {class:"radioOption"};break;
		case "radioOptionText": 		objectSpecs = {class:"radioOptionInput",content:"Введите значение",id:undefined};break;
		case "radioOptionText edit": 	objectSpecs = {class:"radioOptionInput",content:content,id:undefined};break;
		case "nextElementText": 		objectSpecs = {class:"branchId",content:"id элемента",id:undefined};break;
		case "nextElementText edit":	objectSpecs = {class:"branchId",content:content,id:undefined};break;
		//fields lists
		case "fieldsListText":			objectSpecs = {class:"fieldsListInput",content:"Введите название",id:name};break;
		case "fieldsListMask":			objectSpecs = {class:"fieldsListInput Mask",content:"Маска",id:undefined};break;
		case "fieldsListText edit":		objectSpecs = {class:"fieldsListInput",content:content,id:name};break;
		case "fieldsListMask edit":		objectSpecs = {class:"fieldsListInput Mask",content:content,id:undefined};break;
		
		
		
		//edit buttons block
		case "editbuttonAccordion":		objectSpecs = {class:"editbuttonAccordion",content:content};break;
		case "editP":					objectSpecs = {class:"edit-block",content:undefined, id:undefined};break;
		//summary
		case "summary-element":			objectSpecs = {class:'summary-element',content:undefined, id:undefined};break;
		case "summary-element-name":	objectSpecs = {class:'summary-element-name',content:undefined, id:undefined};break;
		case "summary-element-name-p":	objectSpecs = {class:'summary-element-name-p',content:content, id:undefined};break;
		case "summary-element-value":	objectSpecs = {class:'summary-element-value',content:undefined, id:undefined};break;
		case "summary-element-value-p":	objectSpecs = {class:'summary-element-value-p',content:content, id:undefined};break;
		case "summary-element-valuename": objectSpecs = {class:'summary-element-valuename',content:content, id:undefined};break; 
		case "summary-element-valuevalue": objectSpecs = {class:'summary-element-valuevalue',content:content, id:undefined};break;
		//printing
		case "print-element":				objectSpecs = {class:'print-element',content:undefined, id:undefined};break;
		case "print-element-wrap":				objectSpecs = {class:'print-element-wrap',content:undefined, id:undefined};break;
		case "print-element-name":			objectSpecs = {class:'print-text',content:content, id:undefined};break;
		case "print-element-desc":			objectSpecs = {class:'print-text',content:content, id:undefined};break;
		case "print-element-input-type":	objectSpecs = {class:'print-text',content:content, id:undefined};break;
		case "print-element-input-value":	objectSpecs = {class:'print-text-value',content:content, id:undefined};break;
		
		//case "radioInputTypesDiv"		objectSpecs = {class:"radioInputTypesDiv",id:undefined,content:undefined};break;
		//sync-block
		case "sync-warning":			objectSpecs = {class: "help-annotation warning", content: content, id: undefined};break;
		//gallery
		case "nav-radio":				objectSpecs = {class: "nav-radio", content: content, name: "nav-selection"};break;
		
		default:
		return undefined;
		}
		return objectSpecs;
		
}
/*function showError(errString, element){
	var errDiv = $('.error');
	errDiv.children('.error-text').empty();
	clearUnfilled();
//	errDiv.hide();
	model.getInstance().setHTML($('.error-text'),errString);
	errDiv.addClass("active");
	errDiv.slideDown('fast');
	
	focusElement(element);
	
	
}
function focusElement(element, type){
	if (! (element == undefined) ){
		jElement = $(element);
		if ( jElement.is("div") ){
			jElement.addClass(type == "focus"?"focused":"not-filled");
		}
		else
			jElement.focus();
		
	}
	
}
//Функция для отчистки строки ошибок
function clearErrors(){
		errorElem = $('.error');
		errorElem.slideUp('fast');
		errorElem.children('.error-text').empty();
		errorElem.removeClass("active");
		clearUnfilled();
		
}
function clearUnfilled(){
	$('.not-filled').each(function(){
			$(this).removeClass('not-filled');
		});
}*/
//удаление элемента
function removeElement(element, removeAll){
		var removeType =( ( removeAll === undefined )? true: removeAll);
		controller.getInstance().debugInfo();
		//очистка от евентов
		
		var elements = $('input[type=button], input[type=text], h3, p, textarea, input[type=radio], iput[type=checkbox]', $(element));
		controller.getInstance().clearEvents(elements);
		
		//controller.getInstance().clearEvents(element);
		if (removeType)
			element.remove();
		else
			element.empty();
}
//создает новый блок 
//contents - объект, содержащий необходимые поля
//параметр type = show для создания блока для отображения
//если show не указано - то создается блок для редактирования
function createNewDivElement(type, contents, isEdited, first){
	var newInput;
	isEdited = (isEdited == undefined ? false : isEdited);
	switch (type){
	case "show":
	var	newElement 		= fabric("div", 		getObjectSpecs("divacc",undefined,contents.id));
		//newElement.data("branches", contents.branches);
		newHeader 		= fabric("h3", 			getObjectSpecs("headerAccordion",isEdited?'<span>'+contents.header + '</span>' +'<span class="idSpan">id: '+ contents.id+'</span>': '<span>'+contents.header + '</span>')); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		newInputDiv 	= fabric('div', 		getObjectSpecs('input-block'));
		
		
		
		newHeader.appendTo( newElement );
		controller.getInstance().addEvent(newHeader, 'click', onHeaderClick);
		
		
		newParagraph.appendTo( newElement );
		newParagraph.hide();
		newLine = fabric("br", getObjectSpecs("br") ) ;
		newLine.appendTo(newElement);
		newLine.hide();
		
		newInputDiv.appendTo(newElement);
		newInputDiv.hide();
		
		switch(contents.inputType){
			case "radio":
			
			if ( !(contents.radio == undefined) && !(contents.radioName == undefined) ){
				var	newRadio		= fabric("radio",  		getObjectSpecs("radio",contents.radio,contents.radioName));
				newRadio.appendTo( newInputDiv );
				
				if (!( (contents.branches == undefined) || (contents.branches.length < 2 ) ) ){
					newRadio.change(hideDivElements);
				}
				else{
					controller.getInstance().addEvent(newRadio,'change',function(evt){setTimeout(function(){onTextChanged(evt)}, 100)});
				}
				if (first){
					controller.getInstance().addEvent(newRadio,'change',TriggersOnFirstElement);
					
				}
				controller.getInstance().addEvent(newRadio, 'change', function(){
					view.getInstance().addLabelsAnimation(newRadio);
				});
				if (contents.required){
						model.getInstance().validation.setRequired( newInput);
				}
				
				
				
			}
			//newInputDiv.hide();
			break;
			case "textarea":
				
				newInput		= fabric("text area",  	getObjectSpecs("accordiontextarea",contents.input, 'textarea_'+contents.id)); 
				newInput.appendTo( newInputDiv );
				newInput.change(function(evt){setTimeout(function(){onTextChanged(evt)}, 100)});
				//по ctrl+enter переход на следующий вопрос
			/*	newInput.keydown(function(e){
					if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey){
						$(this).blur();
					}
				});*/
				newInput.keyup(resizeTextArea);
				
				if (first){
					newInput.change(TriggersOnFirstElement);
				}
				if (contents.required){
					model.getInstance().validation.setRequired( newInput);
				}
			//}
			break;
			case "text":
				
				for(var i = 0; i < contents.fieldsList.length; i++){
					newInput = newInput		= fabric("textinline",  	getObjectSpecs("textfield",contents.fieldsList[i].value,'text_'+i+'_'+contents.id)); 
					newInput.appendTo( newInputDiv );
					if (contents.fieldsList[i].required){
						model.getInstance().validation.setRequired( newInput);
					}
					//jQuery mask plug-in
					/*	default options
					 	'0': {pattern: /\d/}, 
						'9': {pattern: /\d/, optional: true}, 
						'#': {pattern: /\d/, recursive: true}, 
						'A': {pattern: /[a-zA-Z0-9]/}, 
						'S': {pattern: /[a-zA-Z]/}
						
						http://igorescobar.github.io/jQuery-Mask-Plugin/
						//используется для установки маски на однострочные поля ввода
					*/
					if (contents.fieldsList[i].mask !== undefined ){
						$(newInput).mask( contents.fieldsList[i].mask );
					}
					controller.getInstance().addEvent( newInput , 'change', function(){
						clearSummaryBlock();
						fillSummaryBlock();
						
					});
					//newInput.data('required', contents.fieldsList[i].required);
					
					if (first){
						newInput.change(TriggersOnFirstElement);
					}
					
				}
				newInput.on('change',function(evt){setTimeout(function(){onTextChanged(evt)}, 100)});
	
				
				
				
				
			break;
		}
		newLine = fabric("br", getObjectSpecs("br") ) ;
		newLine.appendTo(newElement);
		newLine.hide();
		//newRadio.hide();
		//в режиме конструктора отображается кнопка edit
		if (isEdited){
		//newElementIdField = fabric("p",			getObjectSpecs("p", "Id элемента:"+contents.id) );
		newEditBlock    	= fabric("div", getObjectSpecs("editP"));
		newButtonEdit		= fabric("buttoninline",  	getObjectSpecs("editbuttonAccordion"	,"Изменить"));
		newButtonCopy		= fabric("buttoninline",  	getObjectSpecs("editbuttonAccordion"	,"Скопировать"));
		var newButtonDelete	= fabric("buttoninline",  	getObjectSpecs("editbuttonAccordion"	,"удалить"));
		//кнопка редактирования
		//	newElementIdField.appendTo( newElement );
			newButtonEdit.click(onEditClick);
			newButtonEdit.appendTo( newEditBlock);
			//newButtonEdit.hide();
			newButtonCopy.click(onCopyClick);
			newButtonCopy.appendTo( newEditBlock);
			//newButtonCopy.hide();
			controller.getInstance().addEvent(newButtonDelete, 'click', function(){
				model.getInstance().blockActions.deleteBlock(newElement);
			});
			newButtonDelete.appendTo( newEditBlock);
			newEditBlock.appendTo ( newElement );
			newEditBlock.hide();
		}
		
	break;
	//заполняем поля значениями, которые были
	case "edit":
			newElement 			= fabric("div", 			getObjectSpecs("div",undefined,undefined) );
			newTitle 			= fabric("h3",				getObjectSpecs("temp-title", contents.title ) );
			newElementNameDiv   = fabric("div", 			getObjectSpecs('blockname-block') );
			newElementName		= fabric("textinline edit", getObjectSpecs("elementName", contents.id) );
			newHeader 			= fabric("textinline edit", getObjectSpecs("temp-div-header", contents.header) );
			var newItemReqP     = fabric("p",				getObjectSpecs("reqP") );
			var newItemReqChbox		= fabric('checkbox', getObjectSpecs('elementRequired',undefined, 'req-chbox_all'));
			var newItemReqLabel		= fabric('label', getObjectSpecs('elementRequiredLabelAll',undefined, 'req-chbox_all'));
			var newBBControlsMain 		= addBBControls(0);
			var newBBControlsAdd 		= addBBControls(1);
			var additionalInfoBlock = fabric("div", 			getObjectSpecs("div",undefined,'additional-info-block') );
			var showAdditionalInfoBlock = fabric("p", getObjectSpecs('additional-info-toggle'));
			newParagraph    	= fabric("text area edit", 	getObjectSpecs("text area", contents.description, 'desc-block') );
			newAdditionalInfoParagraph = fabric("text area edit", 		getObjectSpecs("text area", contents.additionalDescription, 'add-desc-block') );
			newInputDiv 		= fabric("div",				getObjectSpecs("div", undefined ,"radioInputTypesDiv") );
			newInput    		= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newIsSwitchP		= fabric("p",				getObjectSpecs("branchP") );
			newIsSwitch   		= fabric("checkbox" , 		getObjectSpecs("checkboxBranch") );
			newIsSwitchLabel	= fabric("label" , 			getObjectSpecs("checkboxBranchLabel") );
			//newInputRadio   = fabric("text edit", 		getObjectSpecs("text area", contents.radio, "radioOptions") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			newInputRadio   	= createRadioOptionsList(contents.radio, contents.branches);
			newPosition   		= fabric("text edit", 		getObjectSpecs("text area", contents.position ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", contents.inputFieldsCount, "inputFieldsCount") );
			newInputFields      = createTextInputField(contents.fieldsList||undefined);
			newAddElementDiv    = fabric('div', getObjectSpecs('add-block') );
			newAddElementButton = fabric("buttoninline", 		getObjectSpecs("addElementButton") );
			newAddElementButtonP = fabric("p", 		getObjectSpecs("add-block-button") );
			newAddElementPositionDiv  = fabric('div', getObjectSpecs('add-block-position__div') );
			var newAddElementPositionRadio = fabric('radio', getObjectSpecs('add-block-position__radio') );
			
			
			
			addHelpTriggers();
			newTitle.appendTo( newElement);
			
		/*	newElementName.appendTo( newElementNameDiv);
			
			newElementCheckboxLabel.appendTo( newElementNameDiv);
			newElementCheckbox.prop('checked', autofill);*/
			//записываем ветки
			newElementName.appendTo( newElementNameDiv);
			newElementNameDiv.appendTo( newElement);
			
			//newElement.data("branches", contents.branches);
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			
			newBBControlsMain.appendTo(newElement);
			//newHeader.children(':input').val(contents.header);
			newParagraph.appendTo( newElement );
			newParagraph.keyup(resizeTextArea);
			
			showAdditionalInfoBlock.appendTo( newElement );
			showAdditionalInfoBlock.click ( view.getInstance().toggleAdditionalInfoBlock );
			additionalInfoBlock.appendTo( newElement );
			newBBControlsAdd.appendTo(additionalInfoBlock);
			newAdditionalInfoParagraph.appendTo( additionalInfoBlock );
			newAdditionalInfoParagraph.keyup(resizeTextArea);
			
			//newParagraph.val(contents.description);
			newIsSwitchP.appendTo( newElement );
			newIsSwitch.appendTo( newIsSwitchP );
			newIsSwitchLabel.appendTo( newIsSwitchP );
			newIsSwitch.click(onBranchClick);
			//newInput.appendTo ( newElement );
			newInput.appendTo ( newInputDiv );
			
			newInputDiv.appendTo(newElement);

			newInputRadio.appendTo ( newElement );
		//	newInputRadio.hide();
			newInputFields.hide();
			newInputFields.appendTo( newElement );
			
			newAddElementDiv.appendTo (newElement);
			newAddElementButtonP.appendTo ( newAddElementDiv);
			newAddElementButton.appendTo ( newAddElementButtonP);
			newAddElementPositionDiv.appendTo( newAddElementDiv );
			newAddElementPositionRadio.appendTo( newAddElementPositionDiv );
			newItemReqChbox.appendTo( newItemReqP );
			newItemReqLabel.appendTo( newItemReqP );
			newItemReqP.appendTo( newInputDiv );
			
			controller.getInstance().addEvent(newAddElementPositionRadio, 'change', function(){
				view.getInstance().addLabelsAnimation(newAddElementPositionRadio);
			});
		//	newItemReqChbox.appendTo( newElement );
	//		newItemReqLabel.appendTo( newElement );
			newAddElementButton.click(addElement);
		//	newInputFieldsCount.appendTo(newElement);
		//	newInputFieldsCount.hide();
			
			
			
			var radioValue = 0;
			switch (contents.inputType){
				case "radio":
			//		newInput.find(':input[value="1"]').prop('checked',true);
					radioValue = 1;
					
					//newInputRadio.slideDown("slow");
				break;
				case "textarea":
			//		newInput.find(':input[value="0"]').prop('checked',true);
					radioValue = 0;
					//newInputRadio.hide();
				break;
				case "text":
			//		newInput.find(':input[value="2"]').prop('checked',true);
					radioValue = 2;
					//newInputFields.slideDown("slow");
				break;
					
			}
			if (contents.required ){
				$("#req-chbox_all").prop('checked', true);
			}
			model.getInstance().setRadioValue(newInput, radioValue);
			
				
			//newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			
			
			
			if ( (contents.branches == undefined) || (contents.branches.length < 2 ) ){
				newIsSwitch.prop('checked', false);
				newIsSwitchLabel.removeClass("active-checkBoxLabel");
			}
			else{
				newIsSwitch.prop('checked', true);
				newIsSwitchLabel.addClass("active-checkBoxLabel");
				newInputDiv.hide();
				
				//moveDeleteButtons();
			}
			
			
			
	break;
	//создаем новый temp_div
	default:
			var autofill = model.getInstance().api.settingsValue("autofill") ;
			newElement 			= fabric("div", 			getObjectSpecs("div",undefined,undefined) );
			newTitle 			= fabric("h3",				getObjectSpecs("temp-title", contents.title ) );
			newElementNameDiv   = fabric("div", 			getObjectSpecs('blockname-block') );
			var newItemReqP     = fabric("p",				getObjectSpecs("reqP") );
			var newItemReqChbox		= fabric('checkbox', getObjectSpecs('elementRequired',undefined, 'req-chbox_all'));
			var newItemReqLabel		= fabric('label', getObjectSpecs('elementRequiredLabelAll',undefined, 'req-chbox_all'));
			
			newElementName		= ( ( autofill ) ?
				fabric("textinline edit", 			getObjectSpecs("elementName", model.getInstance().autofillID()) ) :
				fabric("textinline", 			getObjectSpecs("elementName", "Введите имя элемента") )  );
			newElementCheckbox	= fabric("checkbox", 			getObjectSpecs("elementNameAutofill") );
			newElementCheckboxLabel = fabric('label', 		getObjectSpecs("elementNameAutofillLabel") );
			newHeader 			= fabric("textinline", 		getObjectSpecs("temp-div-header", contents.header) );
			var newBBControlsMain 		= addBBControls(0);
			var newBBControlsAdd 		= addBBControls(1);
			var additionalInfoBlock = fabric("div", 			getObjectSpecs("div",undefined,'additional-info-block') );
			var showAdditionalInfoBlock = fabric("p", getObjectSpecs('additional-info-toggle'));
			
			newParagraph    	= fabric("text area", 		getObjectSpecs("text area", contents.description, 'desc-block') );
			newAdditionalInfoParagraph = fabric("text area", 		getObjectSpecs("text area", contents.additionalDescription, 'add-desc-block') );
			newInput    		= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newInputDiv 		= fabric("div",				getObjectSpecs("div",undefined ,"radioInputTypesDiv") );
			newIsSwitchP		= fabric("p",				getObjectSpecs("branchP") );
			newIsSwitch   		= fabric("checkbox" , 	getObjectSpecs("checkboxBranch") );
			newIsSwitchLabel	= fabric("label" , 		getObjectSpecs("checkboxBranchLabel") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			//newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newInputRadio   	= createRadioOptionsList();
			newPosition   		= fabric("text"	    , 	getObjectSpecs("text area", undefined ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", 1, "inputFieldsCount") );
			newInputFields      = createTextInputField();
			newAddElementDiv    = fabric('div', getObjectSpecs('add-block') );
			newAddElementButton = fabric("buttoninline", 		getObjectSpecs("addElementButton") );
			newAddElementButtonP = fabric("p", 		getObjectSpecs("add-block-button") );
			newAddElementPositionDiv  = fabric('div', getObjectSpecs('add-block-position__div') );
			var newAddElementPositionRadio = fabric('radio', getObjectSpecs('add-block-position__radio') );
			
			//очищаем ветви
			//newElement.removeData("branches");
			addHelpTriggers();
			newTitle.appendTo( newElement);
			
			newElementNameDiv.appendTo( newElement);
			newElementName.appendTo( newElementNameDiv);
			newElementCheckbox.appendTo( newElementNameDiv);
			newElementCheckboxLabel.appendTo( newElementNameDiv);
			newElementCheckbox.prop('checked', autofill);
			
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			newBBControlsMain.appendTo(newElement);
			newParagraph.appendTo( newElement );
			
			showAdditionalInfoBlock.appendTo( newElement );
			showAdditionalInfoBlock.click ( view.getInstance().toggleAdditionalInfoBlock );
			//additional info block
			additionalInfoBlock.appendTo( newElement );
			newBBControlsAdd.appendTo(additionalInfoBlock);
			newAdditionalInfoParagraph.appendTo( additionalInfoBlock );
			newAdditionalInfoParagraph.keyup(resizeTextArea);
			newParagraph.keyup(resizeTextArea);
			
			//resizeTextArea
			newIsSwitchP.appendTo( newElement );
			newIsSwitch.appendTo( newIsSwitchP );
			newIsSwitchLabel.appendTo( newIsSwitchP );
			newIsSwitch.click(onBranchClick);
			//newInput.appendTo ( newElement );
			newInput.appendTo ( newInputDiv );
			newInputDiv.appendTo(newElement);
			
			
			newInputRadio.appendTo ( newElement );

		//	newInputRadio.hide();	
			newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			//newInputFieldsCount.appendTo(newElement);
			//newInputFieldsCount.hide();
			
			newInputFields.hide();
			newInputFields.appendTo( newElement );
			newAddElementDiv.appendTo (newElement);
			newAddElementButtonP.appendTo ( newAddElementDiv);
			newAddElementButton.appendTo ( newAddElementButtonP);
			newAddElementPositionDiv.appendTo( newAddElementDiv );
			newAddElementPositionRadio.appendTo( newAddElementPositionDiv );
			
			
			newItemReqChbox.appendTo( newItemReqP );
			newItemReqLabel.appendTo( newItemReqP );
			newItemReqP.appendTo( newInputDiv );
		//	newMask.appendTo(newInputDiv );
			
			controller.getInstance().addEvent(newAddElementPositionRadio, 'change', function(){
				view.getInstance().addLabelsAnimation(newAddElementPositionRadio);
			});
			
			newAddElementButton.click(addElement);
	}
	return newElement;
}
//создает элемент временный 
function createNewTempElement(contents, edit){
	edit = (edit == undefined? true : edit);
	if (contents == undefined){
		var contents = {
			id: undefined,
			header:"Введите заголовок блока",
			description:"И его описание",
			additionalDescription: "Дополнительная информация",
			radio: undefined,
			radioName: undefined,
			input: "Im just some text",
			inputType:  undefined,
			branches: undefined,
			fieldsList: undefined,
			title: "Создание нового блока",
			required: false
			};
		edit = false;
		}
	controller.getInstance().clearEvents($('#elementNameAutofill')[0]);
	removeElement($('#temp_divs'), false);
	//$('#temp_divs').empty();
	newElement = createNewDivElement(edit?"edit":undefined,contents);
	newElement.appendTo( $('#temp_divs') );
	$("#req-chbox_all", '#temp_divs').prop('checked', contents.required);
	controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change', model.getInstance().api.saveSettings);
	controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change', model.getInstance().autofillIDClick);
	$('#desc-block').keyup();
	$('#add-desc-block').keyup();
	
	//newElement.hide();
	
	//сдвигаем кнопки в списке
	moveDeleteButtons();
	//newElement.slideDown("slow");
		$('input[name=inputType]','#temp_divs').change(function()	{
			$('#radioInputTypesDiv').removeClass('focused');
			
			
			inputTypeSelector = $('input[name=inputType]:checked');
			$('label[for='+inputTypeSelector.attr('id')+']').addClass('active-checkBoxLabel');
			$('input[name=inputType]').not(":checked").each(function(){$('label[for='+$(this).attr('id')+']').removeClass('active-checkBoxLabel');});
			
			switch (inputTypeSelector.val()) {
			//radio
			case "1":
				$("#radioOptions", '#temp_divs').slideDown("slow");
				$("#fieldsList", '#temp_divs').slideUp("slow");
				$("#req-block", '#temp_divs').slideDown('slow');
				showHelp("radio");
				
				
			break;
			//text
			case "2":
				
					$("#fieldsList", '#temp_divs').slideDown("slow");
					$("#radioOptions", '#temp_divs').slideUp("slow");
					$("#req-block", '#temp_divs').slideUp('slow');
					$('#req-chbox_all').prop('checked', false);
					showHelp("inputfields");
			break;
			//textarea
			case "0":
				//if (inputTypeSelector.val() == "0"){
					$("#radioOptions", '#temp_divs').slideUp("slow");
					$("#fieldsList", '#temp_divs').slideUp("slow");
					$("#req-block", '#temp_divs').slideDown('slow');
					showHelp("textarea");
				//	}
			break;
			}
		});
		$('input[name=inputType]','#temp_divs').trigger('change');
		view.getInstance().buttonsAnimation('#temp_divs');
		model.getInstance().setRadioValue( $('.add-block-position__div'), 0);
}
//добавляет элемент из temp_div в конец основного контейнера и очищает поля в temp_div
function addElement(){
	
	
	/*clearErrors();*/
	var thisDiv 		= $("#temp_divs").children().first();
	var input 			= undefined;
	var radio 			= undefined;
	var fieldsListArray = undefined;
	var insert 			= false;
	var name = $('#newElementName').val();
	var modelInst 		= model.getInstance();
	var branches = [];
	var required = $('#req-chbox_all').prop('checked');
	//var objElement 		= modelInst.blockActions.getElement( name );
	//var model 			= modeltmp;
	//открываем элемент предыдущий при эдите
	showElement ( modelInst.blockActions.getPrevElement() );
	if ($("#branch").prop("checked") == true){
		branches = [];
		$(".branchId").each(function(){
			branches.push($(this).val());
		});
	}
	else{
		branches = undefined;
		if (modelInst.isEdited() ){
			//если вдруг мы поменяли тип дива с ветвления на другой
			branches = modelInst.blockActions.getElement( name ).branches;//thisDiv.data('branches');
			if (modelInst.blockActions.hasBranches(branches) ){
				modelInst.api.showError('У данного ветвления есть зависимые элементы! Удалите их перед тем, как менять тип данного элемента!');
				$("#branch").trigger('click');
				return;
			}
			else{
			// если length > 1 значит было ["","",.....,""];
				branches = ( (( branches !== undefined) && branches.length > 1) ? undefined: branches);
			}
		}
	}
	
	if (modelInst.isEdited() ){
		var removedBlockID = $('#temp_divs').data('removedBlockID');
		removeElement($('#'+removedBlockID) );
	}	
	var namePattern = /^[a-z]+[a-z,0-9,\-,\_]*$/i;
	
	if ( (name == "") || !(namePattern.test(name) ) ){
		modelInst.api.showError('Имя блока должно быть заполнено, начинаться с латинской буквы \
			и состоять только из латинских букв, цифр, символов "-" и "_"', "#newElementName");
		//$('#newElementName').focus();
		return;
	}
	if ( !($('#'+name).size() == 0 ) ){
		modelInst.api.showError("Элемент с таким id уже существует!", "#newelementName" );
		return;
		
	}
	
	
	
	//var position = undefined;
//	var positionType = 
	try{
		var position = modelInst.getElementInsertPosition();
	}
	catch(ex){
		modelInst.api.showError(ex);
		return;
	}
	if (position === undefined ){
		var position = thisDiv.children('#position').children(':input').val();
	}
	else 
		if ( (position !== '') && (position !=='0' ) ){
			insert = true;
		}
			
	var inputType = $('input[name=' + 'inputType' + ']:checked','#temp_divs');
	if (inputType.length == 0) {
		modelInst.api.showError("Не выбран тип ввода информации", '#radioInputTypesDiv');
		return;
	}
	switch (inputType.val()){
		case "0":
		
				input = "";
				inputTypeVal = "textarea";
				//branches = [];
		break;
		case "1":
			

				inputTypeVal = "radio";
				radio = [];
				radioOptionsList = $('.radioOptionInput');
				radioOptionsFilled = radioOptionsList;
				radioOptionsList.each(function(){
					if ($(this).val() == "" ){
						radioOptionsFilled = radioOptionsFilled.not(this);
					}
				});
				
				if ( radioOptionsFilled.length < 2 ){
					modelInst.api.showError("Для переключателя нужно указать как минимум два значения!","#radioOptions");
					return;
				}
				radioOptionsFilled.each(function(){
					radio.push($(this).val());
				});
		break;
		case "2":
			fieldsListArray = [];
			inputTypeVal = "text";
			inputFields = $(':input[type=text]','#fieldsList').not('.Mask');
			inputFieldsFilled = inputFields;
				inputFields.each(function(){
					if ($(this).val() == "" ){
						inputFieldsFilled = inputFieldsFilled.not(this);
					}
				});
			if ( inputFieldsFilled.length == 0 ){
					modelInst.api.showError("Необходимо заполнить хотя бы одно текстовое поле!", "#fieldsList");
					return;
				}
			inputFieldsFilled.each(function(){
					var maskVal = $(this).siblings('.Mask').val();
					fieldsListArray.push({value:$(this).val(),
					required:($(this).siblings('input[type=checkbox]').prop('checked') === true),
					mask: (( maskVal === '')?undefined: maskVal )
					});
				});
		break;
	}
		

				
	var contents ={
		id: name,
		header:thisDiv.children('p').children(':input[type=text]').val(),
		description:bbCodeParserSingleton.getInstance().bbToHTML($('#desc-block').val()),
		additionalDescription: bbCodeParserSingleton.getInstance().bbToHTML($('#add-desc-block').val()),
		radio: radio,
		radioName: "radio"+name,
		input: input,
		inputType: inputTypeVal,
		branches: branches,
		fieldsList:fieldsListArray,
		previous: undefined,
		required: required
	};
	
	var branchesPrevElement = undefined;
	var lastDiv = undefined;
	var lastDivId = undefined;
	var prevElement = undefined;
	//это новый элемент
	if (position === "") {
		 
		lastDiv = $('#container').children(':last');
		
		if (!(lastDiv.length == 0) ) {
			lastDivId = lastDiv.attr('id');
			prevElement = modelInst.blockActions.getElement( lastDivId);
			branchesPrevElement = prevElement.branches;
	//		contents.previous 	=  lastDivId;	 
			
			//lastDiv.data("branches");
			if ( !(branchesPrevElement == undefined) ) {
				checkedDiv = lastDiv.find(':input[type=radio]:checked');
					if (checkedDiv.length == 0 ){
						modelInst.api.showError("Для элемента с ветвлением нужно выбрать ветвь!", ".divacc:last>.input-block");
						return;
					}
					radioValue = checkedDiv.val();
					prevElement.branches[radioValue] = contents.id;
				}
			
			else{
				prevElement.branches = [contents.id];
				
			}
			
		}
		else{
			contents.previous 	=  null;
		}
		
	}
	
	//элемент с edita, и он первый
	else{
		if (position == 0) {
			contents.previous 	=  null;
			
			
		}
		else{
			if (!insert){
				lastDiv 			= $("#container").children(':nth-child('+position+')');
				lastDivId 			= lastDiv.attr('id');
				prevElement 		= modelInst.blockActions.getElement( lastDivId);
				branchesPrevElement = prevElement.branches;//lastDiv.data("branches");
				
				if (branchesPrevElement.length > 1) {
				checkedDiv = lastDiv.find(':input[type=radio]:checked');
					if (checkedDiv.length == 0 ){
						modelInst.api.showError("Для элемента с ветвлением нужно выбрать ветвь!", ".divacc:last");
						return;
					}
				
					radioValue = checkedDiv.val();
					prevElement.branches[radioValue] = contents.id;
					
				}
				else{
					prevElement.branches = [contents.id];
				}
			}
			
		}
	}
	if ( ( lastDiv !== undefined ) && ( lastDiv.length > 0 ) ) {
		branchesPrevElement = prevElement.branches;
		//lastDiv.data("branches", branchesPrevElement); 
		//записываем изменения предыдущего элемента
		modelInst.blockActions.addElement( prevElement);
	}
	
	removeElement( thisDiv );
	newDiv = createNewDivElement("show",contents, true);
	//modelInst.blockActions.addElement( contents);
	//это новый элемент
	if (position === "") {
		
		newDiv.appendTo( $("#container") );
	}
	
	//элемент с edita, и он первый
	else{
		if (position == 0) {
			var firstElem = $('#container').children(".divacc:first");
				
			if (!modelInst.isEdited() ){
				if (contents.branches === undefined){
						
					contents.branches = ( (firstElem.length === 0) ? undefined: [firstElem.attr('id')] );
				
				}
				else{
					contents.branches[0] =firstElem.attr('id');
				}
			}
			//меняем prev у 
	
			//newDiv.data('branches', contents.branches );
			newDiv.prependTo( $("#container") );
			
			
		}
		else{
			
			if (insert){
				contents.branches = insertElement(newDiv, position, contents.branches);
				
			}
			else{
			//newDiv.data('branches', [$('#container').children(":first").attr('id')] );
				lastDiv = $("#container").children(':nth-child('+position+')');
				contents.previous = lastDiv.attr('id');
				newDiv.insertAfter(lastDiv );
			}
			
		
		}
	}
	modelInst.blockActions.addElement( contents);
	newHeader.trigger('click');
	redraw();
	//controller.getInstance().debugInfo();
	
	//controller.getInstance().debugInfo();
	createNewTempElement();//обнуляем значения у temp_div
	if ( modelInst.api.settingsValue('autosave') ){
		modelInst.api.fillSyncMap();
		saveStructure();
	}
	//$('#newElementName').val("");
	//отображаем остальные элементы
	var newElementObj = modelInst.blockActions.getElement( contents.id );
	if ((newElementObj.branches !== undefined) && ( newElementObj.branches.length < 2) ){ 
		showBranch(newElementObj.branches[0],true);
	}
	view.getInstance().buttonsAnimation(newDiv);
	modelInst.setState('new');
	modelInst.blockActions.setPrevElement();
	view.getInstance().toggleControlButtonsState(true);
	modelInst.api.clearErrors();
	showHelp();
}
//нажатие на "редактировать"
function onEditClick(){
	if (model.getInstance().isEdited() ){
		model.getInstance().api.showError('Сначала закончите редактирование текущего элемента');
		return;
	}
	view.getInstance().toggleControlButtonsState(false);
	view.getInstance().hideWarning();
	model.getInstance().setState('edit');
	var position;
	var parentBlock = $(this).parent().parent('div');
	//	var previousBlock = parentBlock.prevAll('div:first');
		//if (previousBlock.length == 0){
			//	position = 0;
		//}
		//else{
	
	
	position = parentBlock.index();
	
	objectDiv = model.getInstance().blockActions.getElement(parentBlock.attr('id'), true);//createObjectFromDiv(parentBlock, false);
	objectDiv.position = position;
	parentBlock.animate({opacity: 'hide',height:0+'px'},{duration:'slow',easing: 'swing',complete:function(){
		$('#temp_divs').data('removedBlockID', parentBlock.attr('id') );
		/*removeElement(parentBlock);*/
		}
	});
	objectDiv.title = "Редактирование блока";
	//removeElement(parentBlock);
	//$('#newElementName').val(objectDiv.id);
	//objectDiv.id = undefined;
	//objectDiv.radio = ["text","radio"];
	//objectDiv.radioName = "inputType";
	createNewTempElement(objectDiv);
	
	var prevBlock = $('#container').children(':nth-child('+(position)+')');
	model.getInstance().blockActions.setPrevElement( prevBlock );
	//открываем предыдущий блок
	if (prevBlock.length !== 0)
		//var branches = prevBlock
		prevBlock.find('h3').trigger('click');
	
	//для эдита такую возможность уберем
	$('.add-block-position__div').hide();
	model.getInstance().setRadioValue( $('.add-block-position__div'), undefined);
	if (objectDiv.additionalDescription !== ''){
		view.getInstance().toggleAdditionalInfoBlock();
	}
	view.getInstance().scrollToTop();
	
	
}
//нажатие на "скопировать"
function onCopyClick(){
	if (model.getInstance().isEdited() ){
		model.getInstance().api.showError('Сначала закончите редактирование текущего элемента');
		return;
	}
	view.getInstance().hideWarning();
	var parentBlock = $(this).parent().parent('div');
	
	objectDiv = model.getInstance().blockActions.getElement( parentBlock.attr('id'), true);//createObjectFromDiv(parentBlock);
	objectDiv.branches = undefined;
	objectDiv.position = "";
	objectDiv.title = "Создание нового блока";
	
	
	createNewTempElement(objectDiv, true);
	//var autofill = $('#temp_divs').data('autofillID') ;
	if (model.getInstance().api.settingsValue('autofill' ) ){
		$('#newElementName').val(model.getInstance().autofillID());
	}
	view.getInstance().scrollToTop();
	
	
}
//если есть ветвление - то тип по дефолту радио
function onBranchClick(){
	$(':input[name=inputType]').each(function(){
		
			$('label[for='+$(this).attr('id')+']').removeClass("active-checkBoxLabel");
		});
	$('label[for='+$(':input[name=inputType][value=1]').attr('id')+']').addClass("active-checkBoxLabel");
	//model.getInstance().setRadioValue( $('input[name=inputType]'), 1);
	$('label[for='+$(this).attr('id')+']').toggleClass("active-checkBoxLabel");
	if ($(this).is(':checked') ) {
	//	$("#req-block", '#temp_divs').slideUp('slow');
		$('#req-chbox_all').prop('checked', false);
		//$('label[for='+$(this).attr('id')+']').addClass("active-checkBoxLabel");
		$(':input[name=inputType][value=1]').prop('checked',true);
		
		
	//	$('#branchCheckBox').addClass("activeCheckBox");
		$("#radioOptions", '#temp_divs').slideDown("slow");
		$('#radioInputTypesDiv').slideUp("slow");
		$('#fieldsList').slideUp("slow");
		//$('.removebutton').animate({"left": "+=50px"}, "slow");
		
		$('.removebutton', '#radioOptions').animate({"left": "+=100px"}, {duration:"slow",complete:function(){
				$('.removebutton', '#radioOptions').css("left", 0);
				$('.branchId').slideDown("slow");
			}
		})
		showHelp("branches");
		//$('.branchId').slideToggle("slow");
	}
	else{
		//$('label[for='+$(this).attr('id')+']').removeClass("active_checkBoxLabel");
		//$(':input[name=inputType][value=radio]').attr('checked',"checked");
		//$("#radioOptions", '#temp_divs').hide();
		//$(':input[name=inputType][value=radio]').attr('checked',undefined)
		$('#radioInputTypesDiv').slideDown("slow");
		$('.branchId').animate({"height": "hide"}, {duration:"slow",complete:function(){
				$('.removebutton', '#radioOptions').css("left", 100);
				$(this).siblings(":input[type=button]").animate({"left": "-=100px"}, "slow");
			}
		});
		$("#req-block", '#temp_divs').slideDown('slow');
		//showHelp("input");
		showHelp("radio");
	}
	//showHelp("radio");	
	
}
function radioOptionsIsFilled(){
	radioOptionsList = $(':input[type=text]','.radioOption').not('.branchId');
	radioOptionsFilled = radioOptionsList;
	radioOptionsList.each(function(){
		if ($(this).val() == "" ){
			radioOptionsFilled = radioOptionsFilled.not(this);
		}
	});
				
		if ( radioOptionsFilled.length < 2 ){
			return false;
		}
		return true;
}
//Отображение и добавление для значений перечилсений
//список для radio в созаднии элемента
function createRadioOptionsList( optionsList, branchesList ){
	newRadioOptions 	= fabric("div"	    , 	getObjectSpecs("div", undefined ,"radioOptions" ) );
	newRadioOptionsAdd 	= fabric("buttoninlinetooltip", getObjectSpecs("addbutton","Добавить ещё элемент") );
	newRadioOptionsAdd.click(addRadioOptionsListItem);
	
	if (optionsList == undefined ){
		// для нового элемента

		
		
		newOption1 				= fabric("textinline",getObjectSpecs("radioOptionText" ));
		newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		newIn2                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		newOption1NextElement	= fabric("textinline", 		getObjectSpecs("nextElementText" ) );
		newOption1Remove  		= fabric("buttoninlinetooltip",	getObjectSpecs("removebutton") );
		newOption2 				= fabric("textinline"	    , 		getObjectSpecs("radioOptionText" ) );
		newOption2NextElement	= fabric("textinline",		getObjectSpecs("nextElementText" ) );
		newOption2Remove  		= fabric("buttoninlinetooltip",	getObjectSpecs("removebutton") );
		newOption1Remove.click(removeRadioOptionsListItem);
		newOption2Remove.click(removeRadioOptionsListItem);
		newIn.appendTo (newRadioOptions);
		newIn2.appendTo (newRadioOptions);
		newOption1.appendTo(newIn);
		
		newOption1NextElement.appendTo(newIn);
		// newOption1.appendTo(newRadioOptions);
		newOption2.appendTo(newIn2);
		
		newOption2NextElement.appendTo(newIn2);
		newOption1Remove.appendTo(newIn);
		newOption2Remove.appendTo(newIn2);
		
		

		newOption1.change(function(){
		if ( radioOptionsIsFilled() ){
			model.getInstance().api.clearErrors();
		}
			
		});
		newOption2.change(function(){
		if ( radioOptionsIsFilled() ){
			model.getInstance().api.clearErrors();
		}
			
		})
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
		branches = ( !(branchesList == undefined) && ( branchesList.length > 1 ) ) ? true:false;
		for (var i = 0; i < optionsList.length; i++ ){
			newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
			newIn.appendTo (newRadioOptions);
			newOption 				= fabric("textinline edit", 		getObjectSpecs("radioOptionText edit", optionsList[i]  ) );
			newOptionRemove  		= fabric("buttoninlinetooltip",   			getObjectSpecs("removebutton") );
			if (branches && !(branchesList[i]=="") ){
				newOptionNextElement	= fabric("textinline edit", getObjectSpecs("nextElementText edit", branchesList[i])   );
			}
			else{
				newOptionNextElement	= fabric("textinline", getObjectSpecs("nextElementText"  ) );
			}
			
			newOptionRemove.click(removeRadioOptionsListItem);
			newOption.appendTo(newIn);
			newOption.change(function(){
				if ( radioOptionsIsFilled() ){
					model.getInstance().api.clearErrors();
				}
			
				});
			newOptionNextElement.appendTo(newIn);
			newOptionRemove.appendTo(newIn);
			if ( !branches ){
				newOptionNextElement.hide();
				
			}
			else{
				//newOptionRemove.animate({"left": "+=100px"},'fast');
				newOptionNextElement.show();
				
				
			}
			
		}
	}
	newRadioOptionsAdd.appendTo(newRadioOptions); 
	return newRadioOptions;
}
function moveDeleteButtons(){
	if ( $("#branch").prop('checked') == true ){
		deleteButtonsSelection = $(".removebutton", "#radioOptions");
		//deleteButtonsSelection.each(function(){
		//	$(this).animate({"left": "+=100px"},'fast');
		//});
	}
}
//добавляет в список ещё одно поле
function addRadioOptionsListItem(){
		newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		//newIn.appendTo (newRadioOptions);
		newOption 				= fabric("textinline"	    	, 	getObjectSpecs("radioOptionText" ) );
		newOptionRemove  		= fabric("buttoninlinetooltip",   getObjectSpecs("removebutton") );
		newOptionNextElement	= fabric("textinline", 		getObjectSpecs("nextElementText") );
		// newOptionNextElement.insertAfter(newOption1.children('input[type=button]'));
		newOptionRemove.click(removeRadioOptionsListItem);
		newIn.insertBefore(newRadioOptions.children("input[type=button]"));
		newOption.appendTo(newIn);
	   	newOptionNextElement.appendTo(newIn);
		newOptionRemove.appendTo(newIn);
		newIn.hide();
		// newOption.appendTo($("#radioOptions"));
		if ($("#branch").is(':checked') ){
			/*newOptionNextElement.show();*/
		//	newOptionRemove.animate({"left": "+=100px"},'fast');
		//	newOptionRemove.css("left",0);
			newOptionNextElement.show();
		}
		else{
			newOptionNextElement.hide();
		}
		newIn.slideToggle("slow");
}	
function removeRadioOptionsListItem(){
	var	element = $(this).parent("p");
		element.animate({height:0, opacity:'hide'},{duraiton:"slow", complete:function(){
			removeElement($(this));
			}	
		});
		//element = $(this).parent("p").remove();
}

//----------------------------------------------------------------------------------------------------------------------
//Отображение и добавление для текстовых полей
function createTextInputField( fieldsList){
	
	model.getInstance().initIdCounter(0);
	
	newFieldsList 		= fabric("div"	    , 	getObjectSpecs("div", undefined ,"fieldsList" ) );
	newFieldsListAdd 	= fabric("buttoninlinetooltip", getObjectSpecs("addbutton") );
	
	//new
	if (fieldsList == undefined) {
		newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
		newItem 			= fabric("textinline",getObjectSpecs("fieldsListText"  ));
		var newMask 		= fabric('textinline', getObjectSpecs('fieldsListMask') );
		newItemReqChbox		= fabric('checkbox', getObjectSpecs('elementRequired',undefined, 'req-chbox_0'));
		newItemReqLabel		= fabric('label', getObjectSpecs('elementRequiredLabel',undefined, 'req-chbox_0'));
		
		newItemRemove  		= fabric("buttoninlinetooltip",	getObjectSpecs("removebutton") );
		
		newItemRemove.click(removeFieldsListItem);
		newItem.appendTo(newItemParagraph);
		newMask.appendTo( newItemParagraph );
		newItemReqChbox.appendTo(newItemParagraph);
		newItemReqLabel.appendTo(newItemParagraph);
		newItemRemove.appendTo(newItemParagraph);
		newItemParagraph.appendTo(newFieldsList);
	}
	//edit
	else {
		for (var i=0; i< fieldsList.length; i++){
			newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
			newItem 			= fabric("textinline edit",getObjectSpecs("fieldsListText edit", fieldsList[i].value ));
			var newMask 		= fabric('textinline edit', getObjectSpecs('fieldsListMask edit',
				((fieldsList[i].mask === undefined)?'': fieldsList[i].mask) ) );
			newItemReqChbox		= fabric('checkbox', getObjectSpecs('elementRequired',undefined, 'req-chbox_'+i));
			newItemReqLabel		= fabric('label', getObjectSpecs('elementRequiredLabel',undefined, 'req-chbox_'+i));
			newItemRemove  		= fabric("buttoninlinetooltip",	getObjectSpecs("removebutton") );
		
			newItemRemove.click(removeFieldsListItem);
			newItem.appendTo(newItemParagraph);
			newMask.appendTo(newItemParagraph);
			newItemReqChbox.appendTo(newItemParagraph);
			newItemReqLabel.appendTo(newItemParagraph);
			newItemRemove.appendTo(newItemParagraph);
			newItemParagraph.appendTo(newFieldsList);
			if (fieldsList[i].required){
				newItemReqChbox.prop('checked', true);
			}
			
		}
		model.getInstance().initIdCounter(fieldsList.length-1);
		
	}
	newFieldsListAdd.click(addNewFieldsListItem);
	newFieldsListAdd.appendTo(newFieldsList);
	return newFieldsList;
}




function addNewFieldsListItem(){
	var numItems = model.getInstance().getIdCounter() ;
	newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
	newItem 			= fabric("textinline",getObjectSpecs("fieldsListText" ));
	var newMask 		= fabric('textinline', getObjectSpecs('fieldsListMask') );
	newItemReqChbox		= fabric('checkbox', getObjectSpecs('elementRequired',undefined, 'req-chbox_'+numItems));
	newItemReqLabel		= fabric('label', getObjectSpecs('elementRequiredLabel',undefined, 'req-chbox_'+numItems));
	newItemRemove  		= fabric("buttoninlinetooltip",	getObjectSpecs("removebutton") );
		
	newItemRemove.click(removeFieldsListItem);
	newItem.appendTo(newItemParagraph);
	newMask.appendTo(newItemParagraph);
	newItemReqChbox.appendTo(newItemParagraph);
	newItemReqLabel.appendTo(newItemParagraph);
	newItemRemove.appendTo(newItemParagraph);
	newItemParagraph.hide();
	newItemParagraph.insertBefore(newFieldsList.children("input[type=button]"));
	newItemParagraph.slideDown("slow");
	
	
}
function removeFieldsListItem(){
	element = $(this).parent("p");
		element.animate({height:0, opacity:'hide'},{duraiton:"slow", complete:function(){
			removeElement($(this));
			}	
		});
	
}



//---------------------------------------------------------------------------------------------		
function moveDiv(value, id)
{
	var that = undefined;
	if (value == undefined){
		that = this;
	}
	else{
		that = value;
	}
	$(that).slideUp({duration:'slow',complete:function(){
			that = this;
			contents = model.getInstance().blockActions.getElement($(that).attr('id'), false);//createObjectFromDiv($(that), true);
			
			removeElement($(that));
			if (contents.id == id ){
				first = true;
			}
			else{
				first = false;
			}
			newDivElement = createNewDivElement("show", contents, $('#container').data("sstype")  , first);
			newDivElement.appendTo($('#imported'));
			if (( $('#container').children().length == 0) && (id !== undefined) ){
				showBranch(id, false);
			}
		
		}
	});
	
}
function hideDivElements(){
	divBlock = $(this).parents('.divacc');
	addSavedData(divBlock);
	branches = model.getInstance().blockActions.getElement(divBlock.attr('id') ).branches;//divBlock.data("branches");
	selectedValue = $(this).children(":input[type=radio]").val();
	currBranch = branches[selectedValue];
	//selectedValue = $(this).val();
	nextElements = divBlock.siblings().slice(divBlock.index());
	nextElements.each(function(index, value){moveDiv(value)});
	showBranch(currBranch, false);
		
	
}
//отображает блок с заданным id
function showBranch(currBranch,hide){
	if (currBranch == ""){
		if (!hide){
			clearSummaryBlock();
			fillSummaryBlock();
			showSubmitBlock();
		}
		return;
	}
	else{
			hideSubmitBlock();
			var divElement = $('#'+currBranch);
			var divObj 	   = model.getInstance().blockActions.getElement( currBranch ); 
			divElement.children().hide();
			divElement.appendTo("#container");
			
			
			divElement.children("h3").slideDown({duration:"slow"});
			//divElement.children().not("h3").hide();
			if (hide){
				
				
			}
			else{
				
				divElement.children("h3").trigger("click");
				focusOnInput(divElement);
				hide = true;
			}
			branches = divObj.branches;// divElement.data("branches");
			if  (branches === undefined) {
				if (!hide){
						clearSummaryBlock();
						fillSummaryBlock();
						showSubmitBlock();
					}
				return;
			}
			else{
				if ( model.getInstance().blockActions.hasBranches( branches ) ){
					return;
				}
				else{
					divElement.children("h3");
					showBranch(branches[0], hide);
				}
			}
		
	}
}
//отображение помощи при заполнении редактора
function showHelp(elemType, timeout){
	helpDivSelection = $('#help');
	//helpDivSelection.stop();
	prevType = helpDivSelection.data('type') || undefined;
	if ( prevType == elemType ) 
		return;
	//очищаем блок
	if ( prevType == undefined ){
		//helpDivSelection.hide();
	}
	paragraphSelection = helpDivSelection.children('p');
	
	//paragraphSelection.empty();
	//paragraphSelection.slide
	//заполняем в соотв. с типом
	switch (elemType) {
	case 'name'		   : paragraphSelection.html('В этом поле указывается имя элемента. <br>\
									<strong>  Имя элемента должно начинаться с латинской буквы и состоять \
									из латинских букв и цифр.</strong> Задавайте имена блокам в соответствии \
									с их содержанием, т.к. при выгрузке будут использоваться эти имена.');
						
	break;
	case 'header'	   : paragraphSelection.html('В этом поле указывается заголовок блока.<br>\
											Не используйте в этом поле слишком длинных конструкций, \
											имя блока должно как можно точнее отображать суть блока.');
	break;
	case 'description' : paragraphSelection.html('В этом поле указывается описание блока. <br> \
											Здесь можно указать всю информацию, которую необходимо знать \
											оператору. Постарайтесь не перегружать оператора лишней информацией.');
	break;
	case 'additionalDescription': paragraphSelection.html('В этом поле вы можете указать дополнительную информацию по блоку. Она будет \
															отображена справа от формы заполнения.');
	break;
	case 'input' : paragraphSelection.html('Если требуется сделать несколько ветвей диалога - установите галочку "Ветвление", \
											в противном случае выберите тип вводимой информации');
	break;
	case 'radio' : paragraphSelection.html('Этот тип данных позволяет выбрать одно из нескольких предопределенных значений. <br> \
											Для этого типа данных необходимо указать \
											<strong>как минимум два значения.</strong>  ');
	break;
	case 'inputfields' : paragraphSelection.html('Этот тип данных позволяет создать одно или несколько полей ввода. <br> \
												<strong>В полях ввода необходимо указать название поля.</strong>	');
	break;
	case 'textarea' : paragraphSelection.html('Этот тип данных позволяет создать многострочное поле ввода');
	break;
	case 'branches' : paragraphSelection.html('Позволяет сделать ветвление на основе  выбранного варианта ответа.<br> \
												Для каждого варианта ответа можно указать id элемента, на который шагнет \
												скрипт. <strong>Указывать нужно только уже существующие элементы!</strong>');
	break;
	case 'send'		: paragraphSelection.html('Анкета отправлена успешно!');
	break;
	case 'not-filled': paragraphSelection.html('Заполнены не все обязательные поля!');
	break;
	default: 
		helpDivSelection.slideUp('fast'); 
		
	
		
	}
	view.getInstance().focusElement(".help", "focus");
	helpDivSelection.data('type', ((elemType === undefined)?"null": elemType ) );
	if ( ( (helpDivSelection.css('opacity') == '0') ||(helpDivSelection.css('display') == 'none') )  && (elemType !== undefined) ){
		helpDivSelection.slideDown('fast');
	}
	if (timeout !== undefined){
		setTimeout(function(){showHelp()}, timeout);
	}
	view.getInstance().scrollToTop();
}

function addHelpTriggers(){
	newHeader.focus(function(){
		//$(this).stop(true,true);
		showHelp('header');
	});
	newParagraph.focus(function(){
		//$(this).stop(true,true);
		showHelp('description');
	});
	newAdditionalInfoParagraph.focus( function(){
		showHelp('additionalDescription');
	});
	newHeader.blur(function(){
		//$(this).stop(true,true);
		//showHelp();
	});
	newParagraph.blur(function(){
		//$(this).stop(true,true);
		showHelp('input');
		
	});
	newElementName.focus(function(){
		//$(this).stop(true,true);
		showHelp('name');
	});
}
//возвращает ключ-значение без добавления id и пробелов
function getInputValueArray(element, type){
	value = undefined;
	var altNames = false;
	if (type === 'sync')
		altNames = true;
	var objElement = model.getInstance().blockActions.getElement( element.attr('id') );
	switch (objElement.inputType){
		case 'text':
			//textBlocksSelection = $(element).find("input[type=text]");
			value = [];
			//textBlocksSelection.each(function(index, elem){
			for (var i =0; i < objElement.fieldsList.length; i++){
				value.push({key:objElement.fieldsList[i].value, value:$('#text_'+i+'_'+objElement.id).val(), required:objElement.fieldsList[i].required } );
			}
		break;
		case 'radio':
			radioSelection 		= $(element).find("input[type=radio]:checked");
			value = {key:(altNames? '': 'выбранное значение'), 
				value:$('label[for='+$(radioSelection).attr('id')+']').text()
			};
		break;
		case 'textarea':
			textAreaSelection 	= $(element).find("textarea");
			value = {key:(altNames? '': 'текстовое поле'), value:textAreaSelection.val()};
		break;
	}
	
	return $.isArray(value)? value : [value];
	
	
	
	
}
function fillSummaryBlock(){
	$('#container').children().each(function(index, value){
			
			var newBlock = fabric('div', getObjectSpecs('summary-element') );
				
			//раскраска цветом
			if ((index % 2) === 0 ){
				newBlock.addClass('odd');
			}
			var newNameBlock = fabric('div', getObjectSpecs('summary-element-name') );
			var newValueBlock = fabric('div', getObjectSpecs('summary-element-value') );
			var newNameParagraph = fabric('p', getObjectSpecs('summary-element-name-p', $(this).children('h3').text()) );
			newNameBlock.appendTo(newBlock);
			newNameParagraph.appendTo(newNameBlock);
			
			newValueBlock.appendTo(newBlock);
			
			var values = getInputValueArray($(this));
			//todo
			//change to normal code
			var objElement = model.getInstance().blockActions.getElement( $(this).attr('id') );
			
			for (var i=0; i< values.length; i++ ){
				
				var newValueNameSpan = fabric('p', getObjectSpecs('summary-element-valuename', values[i].key +
					((values[i].required || objElement.required)?'(*)':'') + ': ') );
				if ( (values[i].required || objElement.required) 
					&& ($.trim(values[i].value) === '' ) ){
					newValueNameSpan.addClass('summary-unfilled');
				}
				//var value = '<span style="float: left; width: 200px; height: 100%">'+values[i].key + ': </span>' ;
				var newValueValueSpan = fabric('p', getObjectSpecs('summary-element-valuevalue', values[i].value) );
				
				
				var newValueParagraph = fabric('div', getObjectSpecs('summary-element-value-p') );
				if ( (values[i].value === undefined) || (values[i].value == '') ){
					//todo indication unfilled
					//newValueBlock.addClass('not-filled');
				}
				newValueNameSpan.appendTo( newValueParagraph);
				newValueValueSpan.appendTo( newValueParagraph);
				newValueParagraph.appendTo(newValueBlock);
				
			}
			$('#summary').append(newBlock);
			var that = this;
			controller.getInstance().addEvent(newBlock, 'click', function(){
				showElement($(that).attr('id'));
			/*	$(newBlock).addClass('active-block');
				$(newBlock).siblings().each(function(){
					$(this).removeClass('active-block');
				});*/
			});
		});
}
function clearSummaryBlock(){
	$('.summary-element').each(function(){removeElement(this)});
}
function showSubmitBlock(){
	
	
	$('#submit-block').slideDown({duration:"slow", complete:function(){
		//$('#submit-block').toggleClass("dummy");
		//$('.tableRight').toggleClass("dummy");
		$('#summary').slideDown({duration:'slow', complete:function(){
			$('#btnSendData').parent().slideDown('slow');}
		});
		}
	});
	//$('.tableRight').toggleClass("dummy");
	//$('#submit-block').toggleClass("dummy");
}
function hideSubmitBlock(){
	$('#summary').slideUp({duration:"slow", complete:function(){
			$('#submit-block').slideUp("slow");
			$('#btnSendData').parent().slideUp('slow');
			clearSummaryBlock();
		//$('.tableRight').toggleClass("dummy");
			}
		});
	//$('.tableRight').toggleClass("dummy");
	//$('#submit-block').toggleClass("dummy");
}
function reloadStructure(){
	clearData();
	$('#container:first').data('started', false);
	var divBlock = $('#container').children('div');
	var id = model.getInstance().blockActions.getStructure().first;//divBlock.first().attr('id');
	//nextElements = divBlock.siblings();
	divBlock.each( function(index, value){
		moveDiv(value, id)
	});
	view.getInstance().hideWarning();
	model.getInstance().refreshAdditionalDescription($('#'+id));
	
}
function TriggersOnFirstElement(){
	if ( ($('#container:first').data('started') == undefined ) || (!$('#container:first').data('started')  ) ){
		showHelp();
		fillingStarted();
		$('#container:first').data('started', true);
	}
	//todo: реквест о начале заполнения скрипта
	
}

function hideCanvasHelp(){
	$('#scheeme-help').hide();
}
function findPathToElementStep(element, node){
	var path = undefined;
	//var nodeElement = $('#'+node);
	
	if (node === element )
		return new Array();
	var nodeObj = model.getInstance().blockActions.getElement( node );
	if (nodeObj === undefined) {
		 return undefined;
	}
	var branches = nodeObj.branches;
	//branches = .branches;//nodeElement.data("branches");
	if ( branches == undefined )
		return undefined;
	else{
		if ( branches.length > 1){
			for(var i = 0; i< branches.length; i++ ){
				path = findPathToElementStep(element, branches[i]);
				if (path !== undefined ){
					path.push({"id":node,"branch":i});
					return path;
				}
			}
		}
		else{
			return findPathToElementStep(element, branches[0]);
		}
	}
	
}
function findPathToElement(element){
	var start = $('#container').children().first();
	var path = undefined;
	path = findPathToElementStep(element, start.attr('id'));
	if (path !== undefined ) path.push({id:start.attr('id')});
	return path;
	
}
function showElement( elementID ){
	if (elementID === undefined)
		return;
	//он спрятан и нужно его найти
	var symbolIndex = elementID.search(':');
	var elementId  = elementID;
	var branchIndex = undefined;
	var elementBlock = undefined;
	//если нашлось двоеточие - то это элемент такой, особенный, которого ещё нет.
	if (symbolIndex !== -1 ){
		elementId  = elementID.substring(0, symbolIndex);
		branchIndex = elementID.substring(symbolIndex+1);
	}
	if ($('#'+elementId, '#container').length == 0 ){
		var path = findPathToElement(elementId);
		if (path !== undefined ){
			path.reverse();
			//прячем все блоки
			$('#container').children().each( function(){
				var elem = $(this);
				
				elem.appendTo($('#imported') );
			});
			showBranch( path[0].id, true);
			for (var i = 1; i < path.length; i++ ){
				var elementToShowID = model.getInstance().blockActions.
					getElement(path[i].id).branches[path[i].branch];//$('#'+path[i].id).data('branches')[path[i].branch];
				model.getInstance().setRadioValue( $('#'+path[i].id), path[i].branch);
		//		$($('#'+path[i].id).find('input[type=radio]')[path[i].branch]).prop('checked', true);
				showBranch( elementToShowID, true );
			}
			
		}
	}
	//если это был псевдоэлемент - тогда ставим значение перечисления
	if (symbolIndex !== -1 ){
		model.getInstance().setRadioValue( $('#'+elementId), parseInt( branchIndex));
		//$($('#elementId'+).find('input[type=radio]')[parseInt( branchIndex)]).prop('checked', true).trigger('change');
	}
	elementBlock = $('#'+elementId);
	if (!elementBlock.children('h3').hasClass('active_header') ){ 
		elementBlock.children('h3').trigger('click');
		
	}
	var elemOffset = elementBlock.offset().top;
	var winHeight =  window.innerHeight;
	var windowTimes = elemOffset % winHeight;
	var mainShift = windowTimes * winHeight;
	var addShift = elemOffset - winHeight;
	//view.getInstance().scrollToTop((elemOffset - winHeight/2) );
	
	
}
//двигает вправо влево табицы
function switchTables(event, isRedraw){
	var isActive =  ( $('.state-active').length !== 0 ) ;
	var redraw  = ( ( isRedraw !== undefined) && isRedraw ) ;
	
	
	
	
	if (isActive){
		//$('.tableLeft').show();
	/*$('.tableRight').animate({width: '60%'},{duration:'slow',
		step: function( now, fx ) {
			var data = fx.elem.id;
			$(data).css('flex', '+=1%');
			
			}
		});*/
		
		if (redraw){
			computeTablesWidth(true);
			return;
			
		}
		else{
    
			$('.tableRight').css('flex', '60%');
			$('.tableInfo').css('flex','25%');
		}
		
		
	}
	else{
		if (isRedraw == undefined){
			computeTablesWidth(false);
		}
		else{
			return;
		}
		
	}
	$('#toggle-state-btn').toggleClass('state-active');
	model.getInstance().toggleTooltipMessage($('#toggle-state-btn'), ['развернуть схему', 'свернуть схему']);
	$('.tableLeft').animate({width: 'toggle'}, "fast");
}
function computeTablesWidth(active){
	var coff ;// коэффициэнт для shift'а 
	var shift, 
		canvasWidth,
		tableWidth,
		tableFlex;
	canvasWidth = parseInt( $('#scheeme').css('width'));
	tableWidth 	= parseInt( $('.tableInfo').css('width'));
	tableFlex 	= $('.tableInfo').css('flex') ;
	tableFlex   = Math.floor( parseInt( tableFlex.substring(tableFlex.search('%')-3,tableFlex.search('%')) ) );
		//$('.tableLeft').hide();
	if ( canvasWidth < tableWidth ){
	}
	else{
			//calculating lengths
		
			
			
		shift 		= tableWidth  / canvasWidth ;
		shift		= tableFlex / shift;
		coff 		= 50/canvasWidth * 100;
			//shift 		+= 25;
		shift 		+= coff;
		shift 		= ( ( ( shift  > 70) )? 70 : shift);
		$('.tableRight').css('flex', (100-shift) + '%');
		$('.tableInfo').css('flex', shift+'%');
	
	}
	
}
//отображение помощи по работе со схемой
function showScheemeHelp(){
	$('#scheeme-help-layer').show();
	$('#scheeme-basic-exit').show();
	
	$('#scheeme-help-basic').slideDown({duration:'slow', complete: function(){
		$('.exit-small__div.scheeme').show();
		}
	});
}
function hideScheemeHelp(){
		$('.exit-small__div.scheeme').hide();
		$('#scheeme-help-basic').slideUp({duration:'slow', complete: function(){
		$('#scheeme-basic-exit').hide();
		$('#scheeme-help-layer').hide();
		}
	});
}
//перерисовка схемы
function redraw(){
	if (typeof drawerSingleton !== 'undefined'){
	
		drawerSingleton.getInstance().clear();
		drawerSingleton.getInstance().draw();
		switchTables(undefined, true);
	
	}
}
function addBBControls( num ){
	
	var bbBlock 	= fabric('div', getObjectSpecs('bb-block') );
	var bbBold  	= fabric('buttoninlinetooltip', getObjectSpecs('bb-button', 'Жирный','bb-bold' + num));
	var bbItalic 	= fabric('buttoninlinetooltip', getObjectSpecs('bb-button', 'Курсив','bb-italic'+ num));
	var bbUnderline	= fabric('buttoninlinetooltip', getObjectSpecs('bb-button', 'Подчеркнутый','bb-underline'+ num));
	var bbColor		= fabric('buttoninlinetooltip', getObjectSpecs('bb-button', 'Цвет','bb-color'+ num));
//	var bbColorPick	= fabric('text', getObjectSpecs('colorpicker','Выбор цвета','colorpicker'+ num));
//	var bbColorValue = fabric('hidden', getObjectSpecs('colorpicker','','colorpicker' + num ));
	
	var textareaElement = ( (num === 0) ? '#desc-block': '#add-desc-block');
	bbBold.appendTo(bbBlock);
	bbBold.click(function(){bbCodeParserSingleton.getInstance().addTag($(textareaElement),'b')});
	bbItalic.appendTo(bbBlock);
	bbItalic.click(function(){bbCodeParserSingleton.getInstance().addTag($(textareaElement),'i')});
	bbUnderline.appendTo(bbBlock);
	bbUnderline.click(function(){bbCodeParserSingleton.getInstance().addTag($(textareaElement),'u')});
//	bbColorValue.appendTo( bbBlock);
//	var settings = {defaultValue: '#000000'};
	bbColor.appendTo(bbBlock);
	bbColor.click(function(){bbCodeParserSingleton.getInstance().addTag($(textareaElement),'color', num)});
	//colorpicker init
	var colorpickerScheeme = $('select[name="colorpicker-template"]');
	var bbColorPick = colorpickerScheeme.clone();
	bbColorPick.attr('name', 'colorpicker' + num );
	bbColorPick.attr('id', 'bb-color'+ num );
	bbColorPick.appendTo(bbBlock);
	//var settings = {inline: };
	bbColorPick.simplecolorpicker({picker: true}).simplecolorpicker('selectColor', '#000000');
	//console.log( bbColorPick.val() );
	
	//bbColorPick.simplecolorpicker('selectcolor',  '#000000');
//	bbNewLine.appendTo(bbBlock);
//	bbNewLine.click(function(){bbCodeParserSingleton.getInstance().addTag($('.textarea'),'br')});
	return bbBlock;
	
	
	
}
function resizeTextArea(evt, textAreaElement){
	var element = ( (textAreaElement == undefined) ? $(this) : $(textAreaElement));
	//element.height = 'auto';
	var diff = element[0].scrollHeight - element.height();
	if ( (diff > 4    ) )
		
		element.animate({height:+element[0].scrollHeight+'px'},{duration:"fast"}); 
}
//saving input data ----------------------------------------------------------------------------------------
function saveData(element, value){
	var savedData = getSavedData();
	var elementAdded = false; //flag when to stop loop
	//search for element
	for (var i=0; (i< savedData.items.length) && !elementAdded; i++){
		if (savedData.items[i].id === element.attr('id') ){
			savedData.items[i].value = value;
			elementAdded = true;
		}
	}
	//new element
	if (!elementAdded){
		savedData.items.push({'id': element.attr('id'), 'value': value});
	}
	savedData.last = element.attr('id');
	setCookie('savdata', JSON.stringify(savedData),{expires:24*60*60,path:'/Callcenter'});
	
}
function getSavedData(){
	var savedData = getCookie('savdata');
	if (savedData === undefined){
		savedData = {'items':[],'last':undefined};
	}
	else{
		savedData = JSON.parse(savedData);
	
	}
	return savedData;
	
}
function clearData(){
	removeCookie('savdata');
}
function restoreData(){
	var savedData = getSavedData();
	
	for (var i = 0; i < savedData.items.length; i++){
		var currElement = $('#'+savedData.items[i].id);
		
		var objDiv = model.getInstance().blockActions.getElement( savedData.items[i].id, false);//createObjectFromDiv(currElement);
		
		switch (objDiv.inputType){
		case "textarea":
			//ресайзим текстарею после заполнения.
			currElement.find('textarea').val(savedData.items[i].value[0].value);
			resizeTextArea(undefined, currElement.find('textarea'));
		break;
		case "radio":
			$(currElement.find('input[type=radio]')[savedData.items[i].value[0].value]).prop('checked', true);
			if ( (objDiv.branches !== undefined ) && ( objDiv.branches.length > 1 ) ){
				showBranch(objDiv.branches[savedData.items[i].value[0].value], true);
			}
		break;
		case "text":
			currElement.find('input[type=text]').each(function(index, value){
				if ( index < savedData.items[i].value.length )
					$(value).val(savedData.items[i].value[index].value);
			});
		break;
			
		}
	}
	if ( !$('#'+savedData.last).children('h3').hasClass('active_header') ){
		$('#'+savedData.last).children('h3').trigger('click');
	}
	if (savedData.items.length > 0 ){
		view.getInstance().showWarning('В прошлый раз анкета не была заполнена до конца, данные были восстановлены', reloadStructure);
	}
	/*$('#container').children().each(function(){
		markHeaders($(this));
	});*/
	
}
//сохраняет данные текущего элемента
function addSavedData(divBlock){
	if (!$('#container').data("sstype")){
		var inputValues = getInputValue(divBlock);
		saveData(divBlock, inputValues);
	}
	
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=

function insertElement(element, position, branches){
	var pos = position;
	var nextElementId = undefined;
	var elementToInsertAfter =  $("#container").children(':nth-child('+pos+')');
	//устанавливаем новому элементу ветви предыдущего
	var oldElement 			 = model.getInstance().blockActions.getElement( elementToInsertAfter.attr('id') );
	var branchesOldElement 	 =  oldElement.branches;
	if ( (branchesOldElement !== undefined) && (branchesOldElement.length > 1) ){
		checkedDiv = elementToInsertAfter.find(':input[type=radio]:checked');
		if (checkedDiv.length == 0 ){
			model.getInstance().api.showError("Для элемента с ветвлением нужно выбрать ветвь!", ".divacc:last>.input-block");
			return;
		}
		radioValue = checkedDiv.val();
		if (branchesOldElement[radioValue] !== "" )
			nextElementId = [branchesOldElement[radioValue]];
		branchesOldElement[radioValue] = $(element).attr('id');
			
			
	}
	else{
		nextElementId = branchesOldElement;
		branchesOldElement = [$(element).attr('id')];
	}
	//если вставляется ветвление
	if ( (branches !== undefined) && (branches.length > 1) ){
		var branchIndex = 0;
		branches[branchIndex] = nextElementId[0];
		nextElementId = branches;
	}
	//устанавливаем элементу за которым вставляем в ветви новый элемент
	elementToInsertAfter.data('branches', branchesOldElement );
	//$(element).data('branches', nextElementId);
	$(element).insertAfter( elementToInsertAfter );
	oldElement.branches = branchesOldElement;
	model.getInstance().blockActions.addElement( oldElement );
	return  ;
/*	return {
		branches: nextElementId,
		previous: elementToInsertAfter.attr('id');
		}
*/	
	
	
}