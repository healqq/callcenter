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

			showError("Элемент с таким id уже существует!", "#newElementName");
			// throw new exeption;
			return;

		}
	}
	//получаем данные, которые вставим внутрь элемента
	elementInnerData = (options.content == undefined)? "": options.content;
	switch ( type ) {
		case "br":
			elementContent = '<br>'; break;
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
function onHeaderClick(){
	var that = $(this);
	that.siblings().slideToggle("slow");
	var div_block = that.parent("div");
	allDivBlocks = div_block.siblings().not(div_block);
	allDivBlocks.children().not("h3").slideUp("slow");
		
	that.toggleClass("active_header");
	
	allDivBlocks.children('h3').each(function(){
		$(this).removeClass("active_header");
		});
	
	//div_block.find("textarea").focus();
}
//событие при изменении инпута
//переходит на следующее сообщение, если такое есть.
//иначе просто сворачивает текущее	
function onTextChanged() {
	var divBlock = $(this).parent("div");
	var nextDivBlock = divBlock.next();
	if (nextDivBlock.size() == 0 ){
		//div_block.
		divBlock.children().not("h3").slideUp("slow");
		showSubmitBlock();
	}
	else{
		nextDivBlock.children("h3:first").trigger("click");
	}
	focusOnInput(nextDivBlock);
	
}
//sets focus on input
function focusOnInput(element){
	textareaSelect = element.find("textarea");
	if (textareaSelect.length == 0 ){
		textBlockSelect = element.find("input[type=text]:first").focus();
			
	}
	else{
		textareaSelect.focus();
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
			 divArray.push(createObjectFromDiv(this));
			
		});
		 
	}
	objectJSON.blocks = divArray;
	objectJSON.first  = first;
	return JSON.stringify(objectJSON);
}
function createObjectFromDiv(element){
	var pSelection;
	var radio = undefined;
	var input = undefined;
	var fieldsList = undefined;
	var branchesList = undefined;
	var name, header, description, inputType, inputValues;
	branchesList = $(element).data("branches");
	id 				= $(element).attr("id");
	header 			= $(element).children("h3").children().not(".idSpan").html();
	pSelection 		= $(element).children("p");
	description 	= pSelection.first().html();
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
				radio.push($('label[for='+$(this).attr('id')+']').html());
		});
	}
	
	if (textSelection.length > 0){
		fieldsList = [];
		inputType = "text";
		textSelection.each(function(){
				fieldsList.push($(this).prop("placeholder"));
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
	var container = $(container);
	$("#container").empty();
	firstElement = false;
	for (var i = 0; i < objectJSON.blocks.length; i++){
		if (objectJSON.blocks[i].id == objectJSON.first){
			firstElement = true;
		}
		createNewDivElement("show", objectJSON.blocks[i], isEdited, firstElement).appendTo(container);
		firstElement = false;
		
	}
	
	
	return objectJSON.first;
	//var divArray = 
	
}

//описание классов и параметров для элементов
function getObjectSpecs(type,content,name){
var objectScpecs;
switch (type) {
		case "br": 						objectSpecs = {class:undefined,content:undefined, id:undefined};break;
		case "description":				objectSpecs = {class:"description",content:content};break;
		case "textfield":				objectSpecs = {class:"accordiontext",content:content,id:name};break;					
		case "header":					objectSpecs = {class:"header",content:content};break;
		case "headerAccordion":			objectSpecs = {class:"accordionheader",content:content};break;
		case "text area":				objectSpecs = {class:"textarea",content:content,id:name};break;
		case "accordiontextarea":		objectSpecs = {class:"accordiontextarea",content:content,id:name};break;
		case "radioOptionP": 			objectSpecs = {class:"radioOption"};break;
		case "radioInputTypes":			objectSpecs = {class:undefined,content:["Многострочное поле","Выбор из нескольких элементов","Однострочные поля"],name:"inputType"};break;
		case "radio":					objectSpecs = {class:undefined,content:content,name:name};break;
		case "div":						objectSpecs = {class:undefined,id:name,content:undefined};break;
		case "divacc":					objectSpecs = {class:"divacc",id:name,content:undefined};break;
		case "p":						objectSpecs = {class:undefined,id:name,content:content};break;
		case "editbutton":				objectSpecs = {class:"editbutton",content:content};break;
		//case "removeButtonRadio":		objectSpecs = {class:"removebutton",content:"remove"};break;
		case "removebutton":			objectSpecs = {class:"removebutton",content:"-"};break;
		case "addbutton":				objectSpecs = {class:"editbutton",content:"+"};break;
		case "checkboxBranch":			objectSpecs = {class:'checkBox',content:"Ветвление",id:"branch"};break;
		case "checkboxBranchLabel":		objectSpecs = {class:'checkBoxLabel',content:"Ветвление",id:"branch"};break;
		case "radioOptionText": 		objectSpecs = {class:"radioOptionInput",content:"Введите значение",id:undefined};break;
		case "radioOptionText edit": 	objectSpecs = {class:"radioOptionInput",content:content,id:undefined};break;
		case "nextElementText": 		objectSpecs = {class:"branchId",content:"id элемента",id:undefined};break;
		case "nextElementText edit":	objectSpecs = {class:"branchId",content:content,id:undefined};break;
		case "fieldsListText":			objectSpecs = {class:"radioOptionInput",content:"Введите название",id:undefined};break;
		case "fieldsListText edit":		objectSpecs = {class:"radioOptionInput",content:content,id:undefined};break;
		case "elementName":				objectSpecs = {class:undefined,content:content,id:'newElementName'};break;
		case "addElementButton":		objectSpecs = {class:"addbutton",content:"Добавить элемент",id:'add_div'};break;
		case "addElementButtonP": 		objectSpecs = {class:"addbuttonP",content:undefined,id:undefined};break;
		case "temp-div-header":			objectSpecs = {class:"temp-div-header",content:content};break;
		case "editbuttonAccordion":		objectSpecs = {class:"editbuttonAccordion",content:content};break;
		//case "radioInputTypesDiv"		objectSpecs = {class:"radioInputTypesDiv",id:undefined,content:undefined};break;
		default:
		return undefined;
		}
		return objectSpecs;
		
}
function showError(errString, element){
	var errDiv = $('.error');
	errDiv.hide();
	errDiv.addClass("active");
	errDiv.slideDown('fast');
	$('<p>'+errString+'</p>').appendTo(errDiv);
	focusElement(element);
	
	
}
function focusElement(element){
	if (! (element == undefined) ){
		jElement = $(element);
		if ( jElement.is("div") ){
			jElement.addClass("focused");
		}
		else
			jElement.focus();
		
	}
}
//Функция для отчистки строки ошибок
function clearErrors(){
		errorElem = $('.error');
		errorElem.slideUp('fast');
		errorElem.empty();
		errorElem.removeClass("active");
		$('.focused').each(function(){
			$(this).removeClass('focused');
		});
}
//удаление элемента
function removeElement(element){
		element.remove();
}
//создает новый блок 
//contents - объект, содержащий необходимые поля
//параметр type = show для создания блока для отображения
//если show не указано - то создается блок для редактирования
function createNewDivElement(type, contents, isEdited, first){
	isEdited = (isEdited == undefined ? false : isEdited);
	switch (type){
	case "show":
		newElement 		= fabric("div", 		getObjectSpecs("divacc",undefined,contents.id));
		newElement.data("branches", contents.branches);
		newHeader 		= fabric("h3", 			getObjectSpecs("headerAccordion",isEdited?'<span>'+contents.header + '</span>' +'<span class="idSpan">id: '+ contents.id+'</span>': '<span>'+contents.header + '</span>')); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		
		
		
		
		newHeader.appendTo( newElement );
		newHeader.click( onHeaderClick );
		
		
		newParagraph.appendTo( newElement );
		newParagraph.hide();
		newLine = fabric("br", getObjectSpecs("br") ) ;
		newLine.appendTo(newElement);
		newLine.hide();
		switch(contents.inputType){
			case "radio":
			if ( !(contents.radio == undefined) && !(contents.radioName == undefined) ){
				newRadio		= fabric("radio",  		getObjectSpecs("radio",contents.radio,contents.radioName));
				newRadio.appendTo( newElement );
				
				if (!( (contents.branches == undefined) || (contents.branches.length < 2 ) ) ){
					newRadio.change(hideDivElements);
				}
				else{
					newRadio.change(onTextChanged);
				}
				if (first){
					newRadio.change(TriggersOnFirstElement);
				}
				
				
			}
			newRadio.hide();
			break;
			case "textarea":
				
				newInput		= fabric("text area",  	getObjectSpecs("accordiontextarea",contents.input)); 
				newInput.appendTo( newElement );
				newInput.change(onTextChanged);
				//по ctrl+enter переход на следующий вопрос
				newInput.keydown(function(e){
					if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey){
						$(this).blur();
					}
				});
				newInput.hide();
				if (first){
					newInput.change(TriggersOnFirstElement);
				}
			//}
			break;
			case "text":
				for(var i = 0; i < contents.fieldsList.length; i++){
					newInput = newInput		= fabric("textinline",  	getObjectSpecs("textfield",contents.fieldsList[i])); 
					newInput.appendTo( newElement );
					newInput.hide();
					if (first){
						newInput.change(TriggersOnFirstElement);
					}
					
				}
				newInput.change(onTextChanged);
				newInput.hide();
				
				
			break;
		}
		newLine = fabric("br", getObjectSpecs("br") ) ;
		newLine.appendTo(newElement);
		newLine.hide();
		//newRadio.hide();
		//в режиме конструктора отображается кнопка edit
		if (isEdited){
		//newElementIdField = fabric("p",			getObjectSpecs("p", "Id элемента:"+contents.id) );

		newButton 		= fabric("buttoninline",  	getObjectSpecs("editbuttonAccordion"	,"Изменить"));
		//кнопка редактирования
		//	newElementIdField.appendTo( newElement );
			newButton.click(onEditClick);
			newButton.appendTo( newElement);
			newButton.hide();
		}
	break;
	//заполняем поля значениями, которые были
	case "edit":
			newElement 			= fabric("div", 			getObjectSpecs("div",undefined,undefined) );
			newElementName		= fabric("textinline edit", getObjectSpecs("elementName", contents.id) );
			newHeader 			= fabric("textinline edit", getObjectSpecs("temp-div-header", contents.header) );
			newParagraph    	= fabric("text area edit", 	getObjectSpecs("text area", contents.description) );
			newInputDiv 		= fabric("div",				getObjectSpecs("div", undefined ,"radioInputTypesDiv") );
			newInput    		= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newIsSwitch   		= fabric("checkbox" , 		getObjectSpecs("checkboxBranch") );
			newIsSwitchLabel	= fabric("label" , 			getObjectSpecs("checkboxBranchLabel") );
			//newInputRadio   = fabric("text edit", 		getObjectSpecs("text area", contents.radio, "radioOptions") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			newInputRadio   	= createRadioOptionsList(contents.radio, contents.branches);
			newPosition   		= fabric("text edit", 		getObjectSpecs("text area", contents.position ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", contents.inputFieldsCount, "inputFieldsCount") );
			newInputFields      = createTextInputField(contents.fieldsList||undefined);
			newAddElementButtonP = fabric("p", 		getObjectSpecs("addElementButtonP") );
			newAddElementButton = fabric("buttoninline", 		getObjectSpecs("addElementButton") );
			
			
			
			addHelpTriggers();
			
			newElementName.appendTo( newElement);
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			//newHeader.children(':input').val(contents.header);
			newParagraph.appendTo( newElement );
			//newParagraph.val(contents.description);
			newIsSwitch.appendTo( newElement );
			newIsSwitchLabel.appendTo( newElement );
			newIsSwitch.click(onBranchClick);
			//newInput.appendTo ( newElement );
			newInput.appendTo ( newInputDiv );
			
			newInputDiv.appendTo(newElement);
			newInputRadio.appendTo ( newElement );
		//	newInputRadio.hide();
			newInputFields.hide();
			newInputFields.appendTo( newElement );
			newAddElementButtonP.appendTo ( newElement)
			newAddElementButton.appendTo ( newAddElementButtonP);
			newAddElementButton.click(addElement);
		//	newInputFieldsCount.appendTo(newElement);
		//	newInputFieldsCount.hide();
			
			
			
			switch (contents.inputType){
				case "radio":
					newInput.find(':input[value="1"]').prop('checked',true);
					//newInputRadio.slideDown("slow");
				break;
				case "textarea":
					newInput.find(':input[value="0"]').prop('checked',true);
					//newInputRadio.hide();
				break;
				case "text":
					newInput.find(':input[value="2"]').prop('checked',true);
					//newInputFields.slideDown("slow");
				break;
					
			}
			
				
			//newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			
			
			if ( (contents.branches == undefined) || (contents.branches.length < 2 ) ){
				newIsSwitch.prop('checked', false);
				newIsSwitchLabel.removeClass("active_checkBoxLabel");
			}
			else{
				newIsSwitch.prop('checked', true);
				newIsSwitchLabel.addClass("active_checkBoxLabel");
				
				//moveDeleteButtons();
			}
			
	break;
	//создаем новый temp_div
	default:
			newElement 			= fabric("div", 			getObjectSpecs("divacc",undefined,undefined) );
			newElementName		= fabric("textinline", 			getObjectSpecs("elementName", "Введите имя элемента") );
			newHeader 			= fabric("textinline", 		getObjectSpecs("temp-div-header", contents.header) );
			newParagraph    	= fabric("text area", 		getObjectSpecs("text area", contents.description) );
			newInput    		= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newInputDiv 		= fabric("div",				getObjectSpecs("div",undefined ,"radioInputTypesDiv") );
			
			newIsSwitch   		= fabric("checkbox" , 	getObjectSpecs("checkboxBranch") );
			newIsSwitchLabel	= fabric("label" , 		getObjectSpecs("checkboxBranchLabel") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			//newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newInputRadio   	= createRadioOptionsList();
			newPosition   		= fabric("text"	    , 	getObjectSpecs("text area", undefined ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", 1, "inputFieldsCount") );
			newInputFields      = createTextInputField();
			newAddElementButton = fabric("buttoninline", 		getObjectSpecs("addElementButton") );
			newAddElementButtonP = fabric("p", 		getObjectSpecs("addElementButtonP") );
			
			
			addHelpTriggers();
			newElementName.appendTo( newElement);
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			newParagraph.appendTo( newElement );
			newIsSwitch.appendTo( newElement );
			newIsSwitchLabel.appendTo( newElement );
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
			newAddElementButtonP.appendTo ( newElement)
			newAddElementButton.appendTo ( newAddElementButtonP);
			newAddElementButton.click(addElement);
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
			branches: undefined,
			fieldsList: undefined
			};
		edit = false;
		}
	$('#temp_divs').empty();
	newElement = createNewDivElement(edit?"edit":undefined,contents);
	newElement.appendTo( $('#temp_divs') );
	//newElement.hide();
	
	//сдвигаем кнопки в списке
	moveDeleteButtons();
	//newElement.slideDown("slow");
		$('input[name=inputType]','#temp_divs').change(function()	{
			$('#radioInputTypesDiv').removeClass('focused');
			
			inputTypeSelector = $('input[name=inputType]:checked');
			switch (inputTypeSelector.val()) {
			case "1":
				$("#radioOptions", '#temp_divs').slideDown("slow");
				$("#fieldsList", '#temp_divs').slideUp("slow");
				showHelp("radio");
				
				
			break;
			case "2":
				
					$("#fieldsList", '#temp_divs').slideDown("slow");
					$("#radioOptions", '#temp_divs').slideUp("slow");
					showHelp("inputfields");
			break;
			case "0":
				//if (inputTypeSelector.val() == "0"){
					$("#radioOptions", '#temp_divs').slideUp("slow");
					$("#fieldsList", '#temp_divs').slideUp("slow");
					showHelp("textarea");
				//	}
			break;
			}
		});
		$('input[name=inputType]','#temp_divs').trigger('change');
}
//добавляет элемент из temp_div в конец основного контейнера и очищает поля в temp_div
function addElement(){
	clearErrors();
	
	var name = $('#newElementName').val();
	var namePattern = /^[a-z]+[a-z,0-9,\-,\_]*$/i;
	
	if ( (name == "") || !(namePattern.test(name) ) ){
		showError('Имя блока должно быть заполнено, начинаться с латинской буквы \
			и состоять только из латинских букв, цифр, символов "-" и "_"', "#newElementName");
		//$('#newElementName').focus();
		return;
	}
	if ( !($('#'+name).size() == 0 ) ){
		showError("Элемент с таким id уже существует!", "#newelementName" );
		return;
		
	}
	var thisDiv 		= $("#temp_divs").children().first();
	var input 			= undefined;
	var radio 			= undefined;
	var fieldsListArray = undefined;
	if ($("#branch").is(":checked")){
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
		showError("Не выбран тип ввода информации", '#radioInputTypesDiv');
		return;
	}
	switch (inputType.val()){
		case "0":
		
				input = "";
				inputTypeVal = "textarea";
		break;
		case "1":
			

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
					showError("Для переключателя нужно указать как минимум два значения!","#radioOptions");
					return;
				}
				radioOptionsFilled.each(function(){
					radio.push($(this).val());
				});
		break;
		case "2":
			fieldsListArray = [];
			inputTypeVal = "text";
			inputFields = $(':input[type=text]','#fieldsList');
			inputFieldsFilled = inputFields;
				inputFields.each(function(){
					if ($(this).val() == "" ){
						inputFieldsFilled = inputFieldsFilled.not(this);
					}
				});
			if ( inputFieldsFilled.length == 0 ){
					showError("Необходимо заполнить хотя бы одно текстовое поле!", "#fieldsList");
					return;
				}
			inputFieldsFilled.each(function(){
					fieldsListArray.push($(this).val());
				});
		break;
	}
		

				
	var contents ={
		id: name,
		header:thisDiv.children('p').children(':input[type=text]').val(),
		description:thisDiv.children('textarea').val(),
		radio: radio,
		radioName: "radio"+name,
		input: input,
		inputType: inputTypeVal,
		branches: branches,
		fieldsList:fieldsListArray
	};
	
	branchesPrevElement = undefined;
	//это новый элемент
	if (position === "") {
		lastDiv = $('#container').children(':last');
		if (!(lastDiv.length == 0) ) {
			branchesPrevElement = lastDiv.data("branches");
			if ( !(branchesPrevElement == undefined) ) {
				checkedDiv = lastDiv.find(':input[type=radio]:checked');
					if (checkedDiv.length == 0 ){
						showError("Для элемента с ветвлением нужно выбрать ветвь!", ".divacc:last");
						return;
					}
					radioValue = checkedDiv.val();
					branchesPrevElement[radioValue] = contents.id;
				}
			
			else{
				branchesPrevElement = [contents.id];
				
			}
			
		}
		
	}
	
	//элемент с edita, и он первый
	else{
		if (position == 0) {
			
			
		}
		else{
			lastDiv = $("#container").children(':nth-child('+position+')');
			branchesPrevElement = lastDiv.data("branches");
			
			if (branchesPrevElement.length > 1) {
			checkedDiv = lastDiv.find(':input[type=radio]:checked');
				if (checkedDiv.length == 0 ){
					showError("Для элемента с ветвлением нужно выбрать ветвь!", ".divacc:last");
					return;
				}
			
				radioValue = checkedDiv.val();
				branchesPrevElement[radioValue] = contents.id;
				
			}
		}
	}
	lastDiv.data("branches", branchesPrevElement); 
	thisDiv.remove();
	newDiv = createNewDivElement("show",contents, true);
	//это новый элемент
	if (position === "") {
		
		newDiv.appendTo( $("#container") );
	}
	
	//элемент с edita, и он первый
	else{
		if (position == 0) {
			newDiv.prependTo( $("#container") );
			
		}
		else{
			lastDiv = $("#container").children(':nth-child('+position+')');
			newDiv.insertAfter(lastDiv );
		
		}
	}
	newHeader.trigger('click');
	createNewTempElement(); //обнуляем значения у temp_div
	//$('#newElementName').val("");
	
}
function onEditClick(){
var position;
	var parentBlock = $(this).parent('div');
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
	//$('#newElementName').val(objectDiv.id);
	//objectDiv.id = undefined;
	//objectDiv.radio = ["text","radio"];
	//objectDiv.radioName = "inputType";
	createNewTempElement(objectDiv);
}
//если есть ветвление - то тип по дефолту радио
function onBranchClick(){
	if ($(this).is(':checked') ) {
		$('label[for='+$(this).attr('id')+']').addClass("active_checkBoxLabel");
		$(':input[name=inputType][value=1]').prop('checked',true);
	//	$('#branchCheckBox').addClass("activeCheckBox");
		$("#radioOptions", '#temp_divs').slideDown("slow");
		$(':input[name=inputType]').parent().slideUp("slow");
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
		$('label[for='+$(this).attr('id')+']').removeClass("active_checkBoxLabel");
		//$(':input[name=inputType][value=radio]').attr('checked',"checked");
		//$("#radioOptions", '#temp_divs').hide();
		//$(':input[name=inputType][value=radio]').attr('checked',undefined)
		$(':input[name=inputType]').parent().slideToggle("slow");
		$('.branchId').animate({"height": "hide"}, {duration:"slow",complete:function(){
				$('.removebutton', '#radioOptions').css("left", 100);
				$(this).siblings(":input[type=button]").animate({"left": "-=100px"}, "slow");
			}
		});
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
	newRadioOptionsAdd 	= fabric("buttoninline", getObjectSpecs("addbutton","") );
	newRadioOptionsAdd.click(addRadioOptionsListItem);
	newRadioOptionsAdd.appendTo(newRadioOptions);
	if (optionsList == undefined ){
		// для нового элемента

		
		
		newOption1 				= fabric("textinline",getObjectSpecs("radioOptionText" ));
		newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		newIn2                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		newOption1NextElement	= fabric("textinline", 		getObjectSpecs("nextElementText" ) );
		newOption1Remove  		= fabric("buttoninline",	getObjectSpecs("removebutton") );
		newOption2 				= fabric("textinline"	    , 		getObjectSpecs("radioOptionText" ) );
		newOption2NextElement	= fabric("textinline",		getObjectSpecs("nextElementText" ) );
		newOption2Remove  		= fabric("buttoninline",	getObjectSpecs("removebutton") );
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
			clearErrors();
		}
			
		});
		newOption2.change(function(){
		if ( radioOptionsIsFilled() ){
			clearErrors();
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
			newOptionRemove  		= fabric("buttoninline",   			getObjectSpecs("removebutton") );
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
					clearErrors();
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
		newIn.appendTo (newRadioOptions);
		newOption 				= fabric("textinline"	    	, 	getObjectSpecs("radioOptionText" ) );
		newOptionRemove  		= fabric("buttoninline",   getObjectSpecs("removebutton") );
		newOptionNextElement	= fabric("textinline", 		getObjectSpecs("nextElementText") );
		// newOptionNextElement.insertAfter(newOption1.children('input[type=button]'));
		newOptionRemove.click(removeRadioOptionsListItem);
		newOption.appendTo(newIn);
		newOptionNextElement.appendTo(newIn);
		newOptionRemove.appendTo(newIn);
		newIn.hide();
		// newOption.appendTo($("#radioOptions"));
		if ($("#branch").is(':checked') ){
			//newOptionNextElement.show();
			
			newOptionRemove.animate({"left": "+=100px"},{duration: 'fast',complete:function(){
				newOptionRemove.css("left", 0);
				newOptionNextElement.slideDown('slow');
				}
			});
		}
		else{
			newOptionNextElement.hide();
		}
		newIn.slideToggle("slow");
}	
function removeRadioOptionsListItem(){
		element = $(this).parent("p");
		element.animate({height:0, opacity:'hide'},{duraiton:"slow", complete:function(){
			removeElement($(this));
			}	
		});
		//element = $(this).parent("p").remove();
}

//----------------------------------------------------------------------------------------------------------------------
//Отображение и добавление для текстовых полей
function createTextInputField( fieldsList){
	
	newFieldsList 		= fabric("div"	    , 	getObjectSpecs("div", undefined ,"fieldsList" ) );
	newFieldsListAdd 	= fabric("buttoninline", getObjectSpecs("addbutton") );
	newFieldsListAdd.click(addNewFieldsListItem);
	newFieldsListAdd.appendTo(newFieldsList);
	//new
	if (fieldsList == undefined) {
		newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
		newItem 			= fabric("textinline",getObjectSpecs("fieldsListText" ));
		newItemRemove  		= fabric("buttoninline",	getObjectSpecs("removebutton") );
		
		newItemRemove.click(removeFieldsListItem);
		newItem.appendTo(newItemParagraph);
		newItemRemove.appendTo(newItemParagraph);
		newItemParagraph.appendTo(newFieldsList);
	}
	//edit
	else {
		for (var i=0; i< fieldsList.length; i++){
			newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
			newItem 			= fabric("textinline edit",getObjectSpecs("fieldsListText edit", fieldsList[i] ));
			newItemRemove  		= fabric("buttoninline",	getObjectSpecs("removebutton") );
		
			newItemRemove.click(removeFieldsListItem);
			newItem.appendTo(newItemParagraph);
			newItemRemove.appendTo(newItemParagraph);
			newItemParagraph.appendTo(newFieldsList);
			
		}
	}
	return newFieldsList;
}




function addNewFieldsListItem(){
	newItemParagraph 	= fabric("p", getObjectSpecs("radioOptionP" ));
	newItem 			= fabric("textinline",getObjectSpecs("fieldsListText" ));
	newItemRemove  	= fabric("buttoninline",	getObjectSpecs("removebutton") );
		
	newItemRemove.click(removeFieldsListItem);
	newItem.appendTo(newItemParagraph);
	newItemRemove.appendTo(newItemParagraph);
	newItemParagraph.hide();
	newItemParagraph.appendTo(newFieldsList);
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
	
	if (value == undefined){
		that = this;
	}
	else{
		that = value;
	}
	$(that).slideUp({duration:'slow',complete:function(){
		that = this;
		contents = createObjectFromDiv($(that));
		removeElement($(that));
		if (contents.id == id ){
			first = true;
		}
		else{
			first = false;
		}
		newDivElement = createNewDivElement("show", contents, $('#container').data("sstype")  , first);
		newDivElement.appendTo($('#imported'));
		if (!( $('#container').length) ){
			showBranch(id, false);
		}
		
		}
	});
	
}
function hideDivElements(){
	divBlock = $(this).parent('div');
	branches = divBlock.data("branches");
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
		showSubmitBlock();
		return;
	}
	else{
			divElement = $('#'+currBranch);
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
			branches = divElement.data("branches");
			if ( (branches == undefined) || (branches.length > 1) ) {
				if (branches == undefined){
					showSubmitBlock();
				}
				return;
			}
			else{
				divElement.children("h3");
				showBranch(branches[0], hide);
			}
		
	}
}
//отображение помощи при заполнении редактора
function showHelp(elemType){
	helpDivSelection = $('#help');
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
	default: 
		helpDivSelection.animate({opacity:'hide'},'fast'); 
		
	
		
	}
	focusElement(".help");
	helpDivSelection.data('type', elemType);
	if (helpDivSelection.css('display') == 'none'){
		helpDivSelection.slideDown({duration:'fast',queue:"helpQ"}).dequeue("helpQ");
	}
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
function showSubmitBlock(){
	$('#submit-block').slideDown({duration:"slow", complete:function(){
		//$('#submit-block').toggleClass("dummy");
		$('.tableRight').toggleClass("dummy");
		}
	});
	$('.tableRight').toggleClass("dummy");
	//$('#submit-block').toggleClass("dummy");
}
function hideSubmitBlock(){
	$('#submit-block').slideUp({duration:"slow", complete:function(){
		//$('#submit-block').toggleClass("dummy");
		$('.tableRight').toggleClass("dummy");
		}
	});
	$('.tableRight').toggleClass("dummy");
	//$('#submit-block').toggleClass("dummy");
}
function reloadStructure(){
	divBlock = $('#container').children('div');
	id = divBlock.first().attr('id');
	hideSubmitBlock();
	//nextElements = divBlock.siblings();
	divBlock.each( function(index, value){
		moveDiv(value, id)
	});
	 
	
	
}
function TriggersOnFirstElement(){
	showHelp();
	fillingStarted();
	//todo: реквест о начале заполнения скрипта
	
}