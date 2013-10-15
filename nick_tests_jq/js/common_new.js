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
	header 			= $(element).children("h3").text();
	pSelection 		= $(element).children("p");
	description 	= pSelection.first().text();
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
	isEdited = (isEdited == undefined ? true : isEdited);
	var objectJSON = JSON.parse(stringJSON);
	var newElement;
	var container = $(container);
	$("#container").empty();
	for (var i = 0; i < objectJSON.blocks.length; i++){
		createNewDivElement("show", objectJSON.blocks[i], isEdited).appendTo(container);
		
	}
	return objectJSON.first;
	//var divArray = 
	
}

//описание классов и параметров для элементов
function getObjectSpecs(type,content,name){
var objectScpecs;
switch (type) {
		case "description":				objectSpecs = {class:"description",content:content};break;
		case "header":					objectSpecs = {class:"header",content:content};break;
		case "headerAccordion":			objectSpecs = {class:"accordionheader",content:content};break;
		case "text area":				objectSpecs = {class:"textarea",content:content,id:name};break;
		case "accordiontextarea":		objectSpecs = {class:"accordiontextarea",content:content,id:name};break;
		case "radioOptionP": 			objectSpecs = {class:"radioOption"};break;
		case "radioInputTypes":			objectSpecs = {class:undefined,content:["Многострочный текст","Переключатель","Однострочные поля"],name:"inputType"};break;
		case "radio":					objectSpecs = {class:undefined,content:content,name:name};break;
		case "div":						objectSpecs = {class:undefined,id:name,content:undefined};break;
		case "divacc":					objectSpecs = {class:"divacc",id:name,content:undefined};break;
		case "p":						objectSpecs = {class:undefined,id:name,content:undefined};break;
		case "editbutton":				objectSpecs = {class:"editbutton",content:content};break;
		//case "removeButtonRadio":		objectSpecs = {class:"removebutton",content:"remove"};break;
		case "removebutton":			objectSpecs = {class:"removebutton",content:"remove"};break;
		case "addbutton":				objectSpecs = {class:"editbutton",content:"add"};break;
		case "checkboxBranch":			objectSpecs = {class:undefined,content:"Ветвление",id:"branch"};break;
		case "radioOptionText": 		objectSpecs = {class:"radioOptionInput",content:"Введите значение",id:undefined};break;
		case "radioOptionText edit": 	objectSpecs = {class:"radioOptionInput",content:content,id:undefined};break;
		case "nextElementText": 		objectSpecs = {class:"branchId",content:"Введите id элемента",id:undefined};break;
		case "nextElementText edit":	objectSpecs = {class:"branchId",content:content,id:undefined};break;
		case "fieldsListText":			objectSpecs = {class:"radioOptionInput",content:"Введите значение",id:undefined};break;
		case "fieldsListText edit":		objectSpecs = {class:"radioOptionInput",content:content,id:undefined};break;
		//case "radioInputTypesDiv"		objectSpecs = {class:"radioInputTypesDiv",id:undefined,content:undefined};break;
		default:
		return undefined;
		}
		return objectSpecs;
		
}
function showError(errString, element){
	var errDiv = $('.error');
	errDiv.addClass("active");
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
		$('.error').empty();
		$('.error').removeClass("active");
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
function createNewDivElement(type, contents, isEdited){
	isEdited = (isEdited == undefined ? true : isEdited);
	switch (type){
	case "show":
		newElement 		= fabric("div", 		getObjectSpecs("divacc",undefined,contents.id));
		newElement.data("branches", contents.branches);
		newHeader 		= fabric("h3", 			getObjectSpecs("headerAccordion",contents.header)); 
		newParagraph 	= fabric("p",  			getObjectSpecs("description",contents.description)); 
		
		
		
		
		newHeader.appendTo( newElement );
		newHeader.click( onHeaderClick );
		
		newParagraph.appendTo( newElement );
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
			}
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
			//}
			break;
			case "text":
				for(var i = 0; i < contents.fieldsList.length; i++){
					newInput = newInput		= fabric("text",  	getObjectSpecs("accordiontextarea",contents.fieldsList[i])); 
					newInput.appendTo( newElement );
					
				}
				newInput.change(onTextChanged);
			break;
		}
		//в режиме конструктора отображается кнопка edit
		if (isEdited){
		

		newButton 		= fabric("buttoninline",  	getObjectSpecs("editbutton"	,"edit"));
		//кнопка редактирования
			newButton.click(onEditClick);
			newButton.appendTo( newElement);
		}
	break;
	//заполняем поля значениями, которые были
	case "edit":
			newElement 			= fabric("div", 			getObjectSpecs("div",undefined,contents.id) );
			newHeader 			= fabric("textinline edit", getObjectSpecs("header", contents.header) );
			newParagraph    	= fabric("text area edit", 	getObjectSpecs("text area", contents.description) );
			newInputDiv 		= fabric("div",				getObjectSpecs("div", undefined ,"radioInputTypesDiv") );
			newInput    		= fabric("radio"	, 		getObjectSpecs("radioInputTypes") );
			newIsSwitch   		= fabric("checkbox" , 		getObjectSpecs("checkboxBranch") );
			//newInputRadio   = fabric("text edit", 		getObjectSpecs("text area", contents.radio, "radioOptions") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			newInputRadio   	= createRadioOptionsList(contents.radio, contents.branches);
			newPosition   		= fabric("text edit", 		getObjectSpecs("text area", contents.position ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", contents.inputFieldsCount, "inputFieldsCount") );
			newInputFields      = createTextInputField(contents.fieldsList||undefined);
			
			
			
			addHelpTriggers();
			
			
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			//newHeader.children(':input').val(contents.header);
			newParagraph.appendTo( newElement );
			//newParagraph.val(contents.description);
			newIsSwitch.appendTo( newElement );
			newIsSwitch.children(':input').click(onBranchClick);
			//newInput.appendTo ( newElement );
			newInput.appendTo ( newInputDiv );
			
			newInputDiv.appendTo(newElement);
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();
			newInputFields.hide();
			newInputFields.appendTo( newElement );
		//	newInputFieldsCount.appendTo(newElement);
		//	newInputFieldsCount.hide();
			
			
			
			switch (contents.inputType){
				case "radio":
					newInput.find(':input[value="1"]').prop('checked',true);
					newInputRadio.slideDown("slow");
				break;
				case "textarea":
					newInput.find(':input[value="0"]').prop('checked',true);
					//newInputRadio.hide();
				break;
				case "text":
					newInput.find(':input[value="2"]').prop('checked',true);
					newInputFields.slideDown("slow");
				break;
					
			}
			
				
			//newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			
			
			if ( (contents.branches == undefined) || (contents.branches.length < 2 ) ){
				newIsSwitch.children(":input").prop('checked', false);
			}
			else{
				newIsSwitch.children(":input").prop('checked', true);
			}
	break;
	//создаем новый temp_div
	default:
			newElement 			= fabric("div", 		getObjectSpecs("div",undefined,contents.id) );
			newHeader 			= fabric("textinline", 		getObjectSpecs("header", contents.header) );
			newParagraph    	= fabric("text area", 	getObjectSpecs("text area", contents.description) );
			newInput    		= fabric("radio"	, 	getObjectSpecs("radioInputTypes") );
			newInputDiv 		= fabric("div",				getObjectSpecs("div",undefined ,"radioInputTypesDiv") );
			
			newIsSwitch   		= fabric("checkbox" , 	getObjectSpecs("checkboxBranch") );
			newHeaderParagraph 	= fabric("p",getObjectSpecs("p"));
			//newInputRadio   = fabric("text"	    , 	getObjectSpecs("text area", "введите варианты перечисления","radioOptions") );
			newInputRadio   	= createRadioOptionsList();
			newPosition   		= fabric("text"	    , 	getObjectSpecs("text area", undefined ,"position" ) );
			//newInputFieldsCount = fabric("textinline edit",   getObjectSpecs("text area", 1, "inputFieldsCount") );
			newInputFields      = createTextInputField();
			
			
			addHelpTriggers();
			newHeader.appendTo (newHeaderParagraph);
			newHeaderParagraph.appendTo( newElement );
			newParagraph.appendTo( newElement );
			newIsSwitch.appendTo( newElement );
			newIsSwitch.children(':input').click(onBranchClick);
			//newInput.appendTo ( newElement );
			newInput.appendTo ( newInputDiv );
			newInputDiv.appendTo(newElement);
			
			newInputRadio.appendTo ( newElement );
			newInputRadio.hide();	
			newPosition.children(':input').val(contents.position);
			newPosition.appendTo( newElement );
			newPosition.hide();
			//newInputFieldsCount.appendTo(newElement);
			//newInputFieldsCount.hide();
			
			newInputFields.hide();
			newInputFields.appendTo( newElement );
			
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
	newElement.hide();
	newElement.appendTo( $('#temp_divs') );
	newElement.slideDown("slow");
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
}
//добавляет элемент из temp_div в конец основного контейнера и очищает поля в temp_div
function addElement(){
	clearErrors();
	
	var name = $('#newElementName').val();
	var namePattern = /^[a-z]+[a-z,0-9,\-,\_]*$/i;
	
	if ( (name == "") || !(namePattern.test(name) ) ){
		showError('Имя блока должно быть заполнено, начинаться с латинской буквы \
			и состоять только из латинских букв, цифр, символов "-" и "_"', "#newelementName");
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
	newDiv = createNewDivElement("show",contents);
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
	createNewTempElement(); //обнуляем значения у temp_div
	$('#newElementName').val("");
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
		$('#fieldsList').slideUp("slow");
		//$('.removebutton').animate({"left": "+=50px"}, "slow");
		
		$('.removebutton', '#radioOptions').animate({"left": "+=100px"}, {duration:"slow",complete:function(){
				
				$('.branchId').slideDown("slow");
			}
		})
		//$('.branchId').slideToggle("slow");
	}
	else{
		//$(':input[name=inputType][value=radio]').attr('checked',"checked");
		//$("#radioOptions", '#temp_divs').hide();
		//$(':input[name=inputType][value=radio]').attr('checked',undefined)
		$(':input[name=inputType]').parent().slideToggle("slow");
		$('.branchId').animate({"height": "hide"}, {duration:"slow",complete:function(){
				$(this).siblings(":input[type=button]").animate({"left": "-=100px"}, "slow");
			}
		});
		
	}
		
	
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
		branches = ( !(branchesList == undefined) && branchesList.length > 1) ? true:false;
		for (var i = 0; i < optionsList.length; i++ ){
			newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
			newIn.appendTo (newRadioOptions);
			newOption 				= fabric("textinline edit", 				getObjectSpecs("radioOptionText edit", optionsList[i]  ) );
			newOptionRemove  		= fabric("buttoninline",   			getObjectSpecs("removebutton") );
			newOptionNextElement	= fabric("textinline edit", 		getObjectSpecs("nextElementText edit",branches? branchesList[i]:"" ) );
			newOptionRemove.click(removeRadioOptionsListItem);
			newOption.appendTo(newIn);
			newOption.change(function(){
				if ( radioOptionsIsFilled() ){
					clearErrors();
				}
			
				});
			newOptionRemove.appendTo(newIn);
			newOptionNextElement.appendTo(newIn);
			if ( !branches ){
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
		newIn                   = fabric("p",getObjectSpecs("radioOptionP" ) );
		newIn.appendTo (newRadioOptions);
		newOption 				= fabric("textinline"	    	, 	getObjectSpecs("radioOptionText" ) );
		newOptionRemove  		= fabric("buttoninline",   getObjectSpecs("removebutton") );
		newOptionNextElement	= fabric("textinline", 		getObjectSpecs("nextElementText") );
		// newOptionNextElement.insertAfter(newOption1.children('input[type=button]'));
		newOptionRemove.click(removeRadioOptionsListItem);
		newOption.appendTo(newIn);
		newOptionRemove.appendTo(newIn);
		newOptionNextElement.appendTo(newIn);
		newIn.hide();
		// newOption.appendTo($("#radioOptions"));
		if ($(":input","#branch").is(':checked') ){
			newOptionNextElement.show();
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
function moveDiv()
{
	contents = createObjectFromDiv($(this));
	removeElement($(this));
	newDivElement = createNewDivElement("show", contents);
	newDivElement.appendTo($('#imported'));
	
}
function hideDivElements(){
	divBlock = $(this).parent('div');
	branches = divBlock.data("branches");
	selectedValue = $(this).children(":input[type=radio]").val();
	currBranch = branches[selectedValue];
	//selectedValue = $(this).val();
	nextElements = divBlock.siblings().slice(divBlock.index());
	nextElements.each(moveDiv);
	showBranch(currBranch, false);
		
	
}
//отображает блок с заданным id
function showBranch(currBranch,hide){
	if (currBranch == ""){
		return;
	}
	else{
			divElement = $('#'+currBranch);
			divElement.children().hide();
			divElement.appendTo("#container");
			
			divElement.children("h3").slideDown("slow");
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
				return;
			}
			else{
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
	case 'name'		   : paragraphSelection.text('В этом поле указывается имя элемента. \
									Имя элемента должно начинаться с латинской буквы и состоять \
									из латинских букв и цифр. Задавайте имена блокам в соответствии \
									с их содержанием, т.к. при выгрузке будут использоваться эти имена.');
						
	break;
	case 'header'	   : paragraphSelection.text('meh header');
	break;
	case 'description' : paragraphSelection.text('meh descr');
	break;
	case 'input' : paragraphSelection.text('Если требуется сделать несколько ветвей диалога - установите галочку "Ветвление", \
											в противном случае выберите тип вводимой информации');
	break;
	case 'radio' : paragraphSelection.text('meh radio selection');
	break;
	case 'inputfields' : paragraphSelection.text('meh several input fields');
	break;
	case 'textarea' : paragraphSelection.text('meh simple text');
	break;
	default: 
	//	helpDivSelection.slideUp(); 
		
	break;
		
	}
	helpDivSelection.data('type', elemType);
	//helpDivSelection.slideDown('slow');
}

function addHelpTriggers(){
	newHeader.focus(function(){
		showHelp('header');
	});
	newParagraph.focus(function(){
		showHelp('description');
	});
	newHeader.blur(function(){
		showHelp();
	});
	newParagraph.blur(function(){
		showHelp('input');
		
	});
}