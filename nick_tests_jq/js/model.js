//Начинаем приводить код к MVC
//модель
var model = (function(){
    function model() {
	//private
		var lastid = 0;
		var fieldsListId = 0;
		var prevElement = undefined;
		var syncMap = {};
		var savedStructure = undefined;
		var state ={ element_edit:'new',
					display_view:'controls',
					scroll_top_btn: 'off'	// state используется для контроля пользователя и получения данных
					};						// о текущем состоянии ( варианты 'new', 'edit' )
		var statesList = {
			element_edit:['new', 'edit'],
			display_view:['controls', 'scheeme'],
			scroll_top_btn:['on', 'off']
		}
		var settings = {autosave: false,
			autofill: false
			};
		//help data
		var helpContents = undefined;
		var helpContentsClient = [
			{header:"Начало работы",image:"./css/images/help/1_help_help.png",text: "Вы находитесь в разделе помощи,\
				здесь вы можете узнать о возможностях сервиса и найти некоторые полезные советы, \
				которые помогут вам в работе.<br/>\
				При повторном открытии формы, вы попадете на тот раздел, на котором остановились.<br/> \
				Перейдите на следующий раздел для знакомства с элементами управления."},
			{header:"Заявка",image:"./css/images/help/2_help_script_table.png",text: 'Основную часть экрана \
				занимает форма для заполнения заявки. Для перехода на любой элемент необходимо нажать на \
				заголовок этого элемента. По мере заполнения элементов переход будет выполняться автоматически,\
				для перехода между полями ввода и элементами  удобно пользоваться клавишей \
				<img src="./css/images/help/2_help_tab.jpg"</img>. \
				'},
			{header:"Заявка (продолжение) ",image:"./css/images/help/3_help_restore_fill.png",text: "Вылетел браузер? \
				По-ошибке закрыли вкладку? Не беда! При повторном открытии все уже заполненные блоки будут восстановлены,\
				а внизу появится окно, позволяющее отменить заполнение. А так же можно очистить заполненные поля\
				используя кнопку очистить на левой панели.\
				"},
			{header:"Проверка заявки",image:"./css/images/help/4_help_filling_check.png",text: "При переходе на последний \
				элемент откроется форма проверки анкеты, на которой будут показаны значения всех полей. \
				Если информация в каком-то из блоков неправильная, то для отображения этого блока \
				необходимо нажать на соответствующую строку в форме проверки.\
				"},
			{header:"Отправка анкеты",image:"./css/images/help/5_help_submit_script.png",text: "После того, как анкета\
				проверена, отправьте анкету, нажав на кнопку. Как только анкета отправится - вы увидите оповещение и\
				заполненные поля сбросятся. Можно приступать к новой анкете!"},
			{header:"Заключение",image:"./css/images/Tabus_web.png",text: '<p style="text-align:center"><a href="mailto:ask@tabus.ru" \
			target="_blank">Сюда</a> вы можете присылать возникшие вопросы или пожелания!</p>\
			'},
			
		];
		var helpContentsAdmin = [
			{header:"Help",image:"./css/images/help/no-help.jpg",text: "In progress..."},
		/*	{header:"Заявка",image:"./css/images/help/2_help_script_table.png",text: 'Основную часть экрана \
				занимает форма для заполнения заявки. Для перехода на любой элемент необходимо нажать на \
				заголовок этого элемента. По мере заполнения элементов переход будет выполняться автоматически,\
				для перехода между полями ввода и элементами  удобно пользоваться клавишей \
				<img src="./css/images/help/2_help_tab.jpg"</img>. \
				'},
			{header:"Заявка (продолжение) ",image:"./css/images/help/3_help_restore_fill.png",text: "Вылетел браузер? \
				По-ошибке закрыли вкладку? Не беда! При повторном открытии все уже заполненные блоки будут восстановлены,\
				а внизу появится окно, позволяющее отменить заполнение. А так же можно очистить заполненные поля\
				используя кнопку очистить на левой панели.\
				"},
			{header:"Проверка заявки",image:"./css/images/help/4_help_filling_check.png",text: "При переходе на последний \
				элемент откроется форма проверки анкеты, на которой будут показаны значения всех полей. \
				Если информация в каком-то из блоков неправильная, то для отображения этого блока \
				необходимо нажать на соответствующую строку в форме проверки.\
				"},
			{header:"Отправка анкеты",image:"./css/images/help/5_help_submit_script.png",text: "После того, как анкета\
				проверена, отправьте анкету, нажав на кнопку. Как только анкета отправится - вы увидите оповещение и\
				заполненные поля сбросятся. Можно приступать к новой анкете!"},
			{header:"Заключение",image:"./css/images/Tabus_web.png",text: '<p style="text-align:center"><a href="mailto:ask@tabus.ru" \
			target="_blank">Сюда</a> вы можете присылать возникшие вопросы или пожелания!</p>\
			'},*/
			
		];
		var currentPage = undefined;
		
		//structure
		var scriptStructure = {elements:{}, first: undefined};
		//public
		return{
			
			initIdCounter: function(value){
				fieldsListId = value;
			},
			getIdCounter: function(){
				return ++fieldsListId;
			},
			//функция возвращает id элемента для автозаполнения
			autofillID: function(){
				while ($('#block'+lastid).length > 0){
					lastid++;
				}
				return 'block'+lastid;
			},
			autofillIDClick: function(){
				if ($(this).prop('checked') == true ){
					$('#newElementName').val(instance.autofillID());
					
				}
			},
			//функции для работы основные
			api:{
				//saves settings to cookies +
				settingsValue: function( key ){
					 return settings[key];
				},
				
				saveSettings: function(){
				var autosave = $('#autosave').prop('checked');
				var autofillID = $('#elementNameAutofill').prop('checked');
				 settings = {'autosave': autosave,
								'autofill': autofillID
								};
				setCookie('settings', JSON.stringify(settings), {expires:24*60*60*365,path:'/Callcenter'});
				//$('#temp_divs').data('autofillID', settings.autofillID);
				
				},
			//loading settings +
				loadSettings: function(){
					var savedSettings  =	getCookie('settings');
					if (savedSettings !== undefined){
						try{
							var	savedSettingsObj = JSON.parse(savedSettings);
							
							
						}
						catch(e){
							savedSettingsObj = {'autosave': false,
									'autofill': false
									};
							//showError('Unable to load settings');
							
						}
						var autosaveItem = $('#autosave');
						var autofillItem = $('#elementNameAutofill');
						autosaveItem.prop('checked', savedSettingsObj.autosave);
						//записываем параметр для использования чтобы не дергать печеньки
						//$('#temp_divs').data('autofillID', savedSettingsObj.autofillID);
						settings = savedSettingsObj;
						controller.getInstance().addEvent($('#autosave')[0], 'change', instance.api.saveSettings);
						
						if (autofillItem.length > 0 ){
							autofillItem.prop('checked', savedSettingsObj.autofillID);
							controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change', instance.api.saveSettings);
							controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change',  instance.autofillIDClick);
						}
						
					}
				},
				onRequestFail: function(stringRequestDesc, jqXHR){
					instance.api.showError( stringRequestDesc+": статус: "+jqXHR.status + " " + jqXHR.statusText);
				},
				
				showError: function (errString, element){
				var errDiv = $('.error');
				errDiv.children('.error-text').empty();
				view.getInstance().clearUnfilled();
			//	errDiv.hide();
				instance.setHTML($('.error-text'),errString);
				errDiv.addClass("active");
				errDiv.slideDown('fast');
				
				view.getInstance().focusElement(element);
				view.getInstance().scrollToTop( 128 );
				
				},
				
				//Функция для отчистки строки ошибок
				clearErrors: function (){
						errorElem = $('.error');
						errorElem.slideUp('fast');
						errorElem.children('.error-text').empty();
						errorElem.removeClass("active");
						view.getInstance().clearUnfilled();
						
				},
				/*заполнение соответствия имён полей выгрузки */
				fillSyncMap: function(){
					
					firstElement = $('#container > div:first');
					if (firstElement.length === 0){
					}
					else{
						//var controlSyncMap = {};
						instance.blockActions.allElementsCircuit( firstElement, function ( element){
							var id = element.attr('id');
							var valuesArray = getInputValueArray(element, "sync");
							for (var i=0; i< valuesArray.length; i++ ){ 
								var fieldName = id+valuesArray[i].key;
								if (syncMap[fieldName] === undefined)
									syncMap[fieldName] = {	value: fieldName.replace(RegExp(' ', 'g'),''), 
															id: id
														};
												
									
							}
							
							
						});
						for (var key in syncMap){
							if ( scriptStructure.elements[syncMap[key].id] === undefined ){
								delete syncMap[key];
							}
							
						}
						
					}
					//console.log( syncMap);
					return syncMap;
				},
				getSyncMap: function(){
					return syncMap;
				},
				setSyncMap: function( syncMapLoaded ){
					syncMap = syncMapLoaded;
				},
				saveSyncMap: function(){
					$('.summary-element', '#sync-block').each( function(index, value){
						var fieldName = $(value).data('id');
						var newValue = $(value).find(':input[type=text]').val();
						syncMap[fieldName] = {value: newValue,
												id: syncMap[fieldName].id
											};
					});
					saveStructure();
					view.getInstance().hideSyncBlock();
					
				},
				fillPrintBlock: function(){
					//console.log(scriptStructure.first);
					//Сначала очищаем все
					$('.print-help.warning', '#print-container').remove(); 
					$('.print-element-wrap', '#print-container').remove();
					//$('#print-container').empty();
					//$(
					var helpStr = 'Для печати воспользуйтесь штатными возможностями браузера';
					$('.print-help.help-annotation').children('h5').text(helpStr);
					//структура незаполнена
					if (scriptStructure.first === undefined){
						
						var warningDiv = fabric('div', getObjectSpecs('sync-warning', 
						'Похоже нет ни одного блока,заполните скрипт прежде чем печатать его!') );
						$('#print-container').append(warningDiv);
						return;
					}
					var firstElement = $('#'+scriptStructure.first);
					var addElementToPrintContainer = (function(elem, level){
						var elemId   = $(elem).attr('id');
						var elementInStructure = instance.blockActions.getElement( elemId, false);
						view.getInstance().addElementToPrintBlock(elementInStructure, level);
						//console.log( elementInStructure);
						
					});
					//	var $element = $(element);
						/*var index = 0;*/
					var level = 0;
					instance.blockActions.allElementsCircuit(firstElement, addElementToPrintContainer, level);
					//console.log(firstElement);
				}
				
				
			
			},
			setHTML: function(element, text){
				if ( ( element === undefined ) || ($(element).length === 0) )
					return;
				//очистка
				
				if (text === undefined){
					$(element).empty();
				}
				else{
					$(element).html(text);
				}
				
			},
			setState: function(type){
				state.element_edit = type;
				
			},
			getState: function(){
				return state.element_edit;
			},
			isEdited: function(){
				return (state.element_edit === 'edit');
			},
			onStart: function(){
				var control = controller.getInstance();
				control.addEvent($(window),'beforeunload',function(){
		
					return "Внимание! Вся несохранённая информация будет потеряна! ";
			
				});
				//checkSession();
				//дальше в зависимости от страницы делаем что-то
				if ( $('#container').data('sstype') ){
					instance.api.loadSettings();
					createNewTempElement();
					control.addEvent($("#btnSaveStructure"),'click', function(){
							var r=confirm("Внимание! Старая версия анкеты будет заменена! Продолжить?");
							if (r==true)
							{
								saveStructure();
							}
							else
							{
								//return;
							}
							
						});
					
					control.addEvent($("#sendXML"),'click', sendData);
					control.addEvent($("#logout"),'click', logout);
					control.addEvent($("#toggle-state-btn"),'click', switchTables);
					control.addEvent($("#scheeme-help-btn"),'click', showScheemeHelp);
					control.addEvent($("#scheeme-help-exit"),'click', hideScheemeHelp);
					control.addEvent($("#btnSyncSettings"),'click', view.getInstance().showSyncBlock);
					control.addEvent($(".btnSaveSyncMap"),'click', instance.api.saveSyncMap);
					control.addEvent($("#btnPrintStructure"),'click', view.getInstance().showPrintBlock);
					control.addEvent($("#btnShowHelp"), 'click', function(){
						instance.galleryActions.initGallery("admin");
						});
					
					
					view.getInstance().buttonsAnimation();
					control.addEvent($("#btnLoadStructure"),'click', function(){
						loadStructure(true);
						instance.setState('new');
					});
					control.addEvent($('#close-errors'), 'click', instance.api.clearErrors);
				}
				else{
				
				
					
					loadStructure(false);
					control.addEvent($("#btnLoadStructure"),'click',function(){ loadStructure(false) });
					
					control.addEvent($("#btnSendData"),'click',function(){
						view.getInstance().toggleElementState($("#btnSendData"));
						sendData();
					});
					control.addEvent($("#btnReload"),'click', function(){
						var r=confirm("Внимание! Все заполненные данные будут очищены! Продолжить?");
						if ( r ){
							reloadStructure();
						}
						else{
							
						}
						
					});
					control.addEvent($("#btnShowHelp"), 'click', function(){
						instance.galleryActions.initGallery();
						});
				}
		
		//$("#btnSendData").click(sendData);
				
				control.addEvent($("#btn-scroll-top"), 'click', view.getInstance().scrollToTop);
				control.addEvent($("#logout"), 'click', logout);
				control.addEvent($(window), 'scroll', instance.scrollCheck);
				view.getInstance().buttonsAnimation();
	
			},
			setRadioValue: function(element, index){
				if (index === undefined){
					$(element).find(':input[type=radio]').prop('checked', false);
				}
				var radioElements = $(element).find(':input[type=radio]');
				if (radioElements.length === 0){
					radioElements = $(element).siblings(':input[type=radio]')
				}
				var indexedElement = $(radioElements[index]);
				indexedElement.trigger('click');
			},
			getElementInsertPosition: function(){
				var positionType =  $('input[name=positionType]:checked').val();
				var retValue = undefined;
				switch (positionType){
					case '0': retValue = ""; break;
					case '1': retValue = 0; break;
					case '2': var activeBlock = $('.active_header').parent('div').index();
							if (activeBlock === -1 ){
							throw	'Выберите блок, после которого хотите вставить элемент';
							}
							else{
								retValue = activeBlock + 1;
							}
					break;
					
				}
				return retValue;
			},
			//Функция для смены подсказок 
			//messages = array[2];
			toggleTooltipMessage: function(element, messages){
				var index = statesList.display_view.indexOf(state.display_view);
				index = (index+1)%2;
				$(element).attr('title', messages[ index ] );
				state.display_view = statesList.display_view[index];
				
				
				
				
			},
			scrollCheck: function(){
				var $body = $('body');
				if( $body.scrollTop() > 200 ) {
					if (state.scroll_top_btn === 'off') {
						state.scroll_top_btn = 'on';
						view.getInstance().showScrollTopButton();
					}
					
					
				}
				else{
					if (state.scroll_top_btn === 'on')
						view.getInstance().hideScrollTopButton();
						state.scroll_top_btn = 'off';
					
				}
					
			},
			blockActions:{
				deleteBlock: function(element ){
					if (instance.isEdited() ){
						instance.api.showError('Сначала закончите редактирование текущего элемента');
						return;
					}
					view.getInstance().hideWarning();
					instance.blockActions.saveStructure();
					var $element = $(element);
					var elementID = $(element).attr('id');
				//	console.log(element);
					var objElement 	= instance.blockActions.getElement(elementID );
					var branches 	= objElement.branches;
				//	console.log(instance.blockActions.hasBranches(branches));
					if (instance.blockActions.hasBranches(branches)){
						//нельзя удалить элемент с ветвями 
						instance.api.showError('Нельзя удалить элемент с разветвлением! Сначала удалите дочерние элементы.');
						return false;
					}
					else{
						var prevElem = instance.blockActions.getElement(objElement.previous);
						var nextElem = ( ( branches === undefined )? undefined: instance.blockActions.getElement(branches[0]) );
						
						//var prevElemBranches = prevElem.data('branches');
						//var nextElemBranches = nextElem.data('branches');
						
						//варианты
						//первый элемент:
						//просто удаляем его, изменений в других элементах не будет,
						//но нужна перерисовка
						if (prevElem === undefined ){
							firstElement = ( branches === undefined?undefined:branches[0]);
							removeElement($element);
							instance.blockActions.removeElement(objElement);
							showBranch(firstElement, false);
							
							
							
						}
						else{
							var prevElemBranches = prevElem.branches;
								//последний элемент
								//очищаем ветвь у предыдущего элемента и всё
								if (nextElem === undefined){
									prevElemBranches[prevElemBranches.indexOf(elementID)] = '';
									//prevElemBranches = ( (prevElemBranches.length === 1) ? undefined : prevElemBranches);
									removeElement(element);
									if (prevElemBranches.length === 1){
										prevElemBranches = undefined;
										$('#'+prevElem.id).removeData('branches');
										instance.blockActions.removeElement(objElement);
										prevElem.branches = prevElemBranches;
										instance.blockActions.addElement( prevElem);
										
									}
									else{
										$('#'+prevElem.id).data('branches', prevElemBranches);
										instance.blockActions.removeElement(objElement);
										prevElem.branches = prevElemBranches;
										instance.blockActions.addElement( prevElem);
									}
									
								}
								//элемент в серединке.
								//предыдущему вставляем в ветвь следующий
								else{
									prevElemBranches[prevElemBranches.indexOf(elementID)] = branches[0];
									removeElement(element);
									$('#'+prevElem.id).data('branches', prevElemBranches);
									instance.blockActions.removeElement(objElement);
									prevElem.branches = prevElemBranches;
									instance.blockActions.addElement( prevElem);
									
									
								}
							}
						
						
						redraw();
						view.getInstance().showWarning('Элемент ' + elementID + ' был удален. Нажмите, чтобы отменить удаление.', instance.blockActions.restoreStructure);
					}
					
					
				},
				hasBranches: function(branches){
					//var branches = $(element).data('branches');
					if ( (branches !== undefined) && (branches.length > 1) ){
						for(var i=0; i < branches.length; i++ ){
							if (branches[i] != "")
								return true;
						}
					}
					else{
						return false;
					}
				},
				saveStructure:function(){
					savedStructure = exportToJSON(["#container","#imported"]);
					//$('#container').data('structure', JSONstructure);
				},
				restoreStructure: function(){
					//var savedStruct = $('#container').data('structure');
					if (savedStructure !== undefined){
						first = importFromJSON( savedStructure, "#imported", true);
						showBranch(first,false);
						redraw();
					}
			//		createNewTempElement();
				},
				setPrevElement: function(element){
					prevElement = (element === undefined)? undefined : $(element).attr('id');
				},
				getPrevElement: function(){
					return prevElement;
				},
				/*Применяет функцию ко всем элементам из структуры*/
				allElementsCircuit: function ( element, func, level){
					
					var nextLevel = level;
					func(element, level);
					branchesArray = $(scriptStructure.elements[element.attr('id')].branches);
					branchesArray.each(function(index, value){
						var nextElement = $('#'+value);
						if ( ! (nextElement.length === 0 ) ){
							nextLevel = ( (level === undefined)? undefined: (level + 1) );
							
							instance.blockActions.allElementsCircuit (nextElement, func, nextLevel);
						}
					});
				},
				//инициализация структуры
				setStructure: function( structure, firstElement ){
					scriptStructure = {elements: structure,
						first: firstElement
					};
					scriptStructure.elements[firstElement].previous = null;
					instance.blockActions.loopStructure( firstElement, instance.blockActions.fillPreviousElementToChildren);
					instance.blockActions.clearUnusedBlocks();
					
					//instance.blockActions.allElementsCircuit($('#'+scriptStructure.first), );
				},
				//получение структуры
				getStructure: function(){
					return scriptStructure;
				},
				//Проставляет значение previous для детей текущего элемента
				fillPreviousElementToChildren: function(element){
					var branches = element.branches;
					var currElement = undefined;
					for (var i = 0; (branches !== undefined) && ( i < branches.length); i++){
						currElement = scriptStructure.elements[branches[i]];
						if	(currElement !== undefined ) {
							currElement.previous = element.id;
						}
					}
				},
				//рекурсивный обход дерева с вызовом функции func( element ) 
				loopStructure: function(element, func){
					var currElement = scriptStructure.elements[element];
					if (currElement === undefined){
						return;
					}
					func(currElement);
					//console.log( currElement);
					var nextElements = currElement.branches;
					if ( (nextElements !== undefined) && (nextElements.length !== 0 ) ) {
						$(nextElements).each( function(index, value){
						//var nextElement = scriptStructure.elements[value];
						instance.blockActions.loopStructure(value, func);
						});
					}
					
				},
				//удаление мусорных блоков ( таких блоков не должно быть)
				clearUnusedBlocks: function(){
					for(var element in scriptStructure.elements) {
						if (scriptStructure.elements[element].previous === undefined){
							removeElement($('#'+element));
							delete scriptStructure.elements[element];
						}
   
					}
					
				},
				removeElement: function( element){
					if (element.id === scriptStructure.first ){
						if (element.branches !== undefined){
							scriptStructure.first = element.branches[0];
							scriptStructure.elements[element.branches[0]].previous = null;
						}
						else{
							scriptStructure.first = undefined;
						}
					}
					else{
						if (element.branches !== undefined ){
							for( var i=0 ;i < element.branches.length; i++){
								if (element.branches[i] !== ""){
									scriptStructure.elements[element.branches[i]].previous = element.previous;
								}
							}
						}
					}
					delete scriptStructure.elements[element.id];
				},
				//получает элемент по id
				getElement: function( id, convertBB){
					var retValue = jQuery.extend({},scriptStructure.elements[id]);
					var prepared = ( (convertBB === undefined)? true: !convertBB);
					if ( (!prepared) && (retValue !== undefined) ){
						retValue.description = bbCodeParserSingleton.getInstance().htmlToBB(retValue.description);
					}
					return retValue;
				},
				//добавляет новый элемент
				addElement: function( elementContents){
					scriptStructure.elements[elementContents.id] = elementContents; 
					//Если элемент первый - то предыдущему первому ставим его как предыдущий
					if (elementContents.previous === null){
						var previousElement = scriptStructure.elements[scriptStructure.first];
						if ( (previousElement !== undefined) && (scriptStructure.first !== elementContents.id ) ){
							previousElement.previous = elementContents.id;
						}
						scriptStructure.first = elementContents.id;
					}
					else{
						previousElement = instance.blockActions.findPrevElement( elementContents.id );
						instance.blockActions.fillPreviousElementToChildren( previousElement );
					}
				},
				findPrevElement: function( elementID){
					var elementObj = undefined;
					for ( var element in scriptStructure.elements){
						elementObj = instance.blockActions.getElement( element);
						if ( (elementObj.branches !== undefined) && ( elementObj.branches.indexOf( elementID) !== -1 ) ){
							return elementObj;
						}
					}
					
				},
				
			},
			galleryActions:{
				showItem: function( index, direction ){
					var currentPage = helpContents[index];
					//var modelInstance = model.getInstance();
					
					
					var scrollWrap 		= $('.overflow-wrap');
					var scrollAmount 	= $('.help-slide').width()/2;
					if (!direction) {
						scrollWrap.scrollLeft(scrollAmount);
						$('.help-img').not('.slide').attr('src', currentPage.image);
						instance.setHTML($('.help-text').not('.slide'), currentPage.text);
					}
					else{
						$('.help-img.slide').attr('src', currentPage.image);
						instance.setHTML($('.help-text.slide'), currentPage.text);
						
					}
					instance.setHTML($('#help-title'), currentPage.header);
					/*$('.help-content.slide').show();*/
					
					scrollWrap.animate({scrollLeft:(!direction?"0":scrollAmount)},{duration:"15000",
						complete: function(){
							$('.help-img').attr('src', currentPage.image);
							instance.setHTML($('.help-text'), currentPage.text);
							scrollWrap.scrollLeft(0);
						}
					});
					
				},
				//клик на пункт меню
				/*onNavClick: function(element){
					var newPage = $(element).val();
					
					
					
				},*/
				initGallery: function( type ){
				//init nav
				//инит делается 1 раз, затем просто show/hide
					
					if (currentPage === undefined){
						if (type === "admin"){
							helpContents = helpContentsAdmin;
						}
						else{
							helpContents = helpContentsClient;
						}
						var contentsArray = new Array(helpContents.length);
						for (var i=0; i < helpContents.length; i++){
							contentsArray[i] = "";
						}
						var navRadio = fabric("radio-line", getObjectSpecs('nav-radio', contentsArray ));
						navRadio.appendTo($('.nav-list') );
						//начальные параметры
						currentPage = 0;
						instance.galleryActions.showItem( currentPage, true );
						$('input[type=radio][name=nav-selection]').first().prop('checked', true);
					//buttons handlers
						var controllerInst = controller.getInstance();
						controllerInst.addEvent($('#gallery-exit'), 'click', function() { $('.wrapper').slideUp('slow');});
						controllerInst.addEvent($('input[type=radio][name=nav-selection]'), 'change', function(){
							var newPage = parseInt( $(this).val() );
							instance.galleryActions.showItem( newPage, newPage > currentPage );
							currentPage = newPage;
						});
						controllerInst.addEvent($('#nav-next'), 'click', function(){
							newPage = (currentPage + 1) % helpContents.length;
						//	instance.galleryActions.showItem( currentPage );
							instance.setRadioValue($('input[type=radio][name=nav-selection]'), newPage);
							
						});
						controllerInst.addEvent($('#nav-prev'), 'click', function(){
							newPage = ( (currentPage === 0) ? helpContents.length -1 : currentPage - 1 );
						//	instance.galleryActions.showItem( currentPage  );
							instance.setRadioValue($('input[type=radio][name=nav-selection]'), newPage);
						});
					}
					//show form
					$('.wrapper').slideDown('slow');
				}
			},
				//валидация данных
			validation:{
				inputTypes: ['input[type=radio]','textarea','input[type=text]'],
				//соответствие id-regexp
				patternsHash:{},
				//проверка осуществляется при нажатии на кнопку отправить.
				//1. проверка заполнения полей required ( поиск-по классу)
				//Установка элемента формы как обязательного
				
				addPatternHashPair: function(elements, pattern){
					if (pattern === undefined){
					//тогда ставим любую строку в паттерн
						pattern = '/.*/';
					}
					elements.each(function(index, value){
						/*var elementBlock = $(value).parents('.divacc').attr('id');*/
						
						instance.validation.patternsHash[$(value).attr('id')] = pattern;
					});
					
					
					
				},
				setRequired: function( element){
					$(element).addClass('form-required');
				},
				isRequired: function( element){
					return $(element).hasClass('form-required');
				},
				//done
				checkFilling: function(){
					var errorsList = [];
					var requiredList = $('.form-required','#container');
					while (requiredList.length > 0 ){
						var notFound = true;
						var inputType = 0;
						var $value = $(requiredList[0]);
						for (var i=0; (i<3) && (notFound) ;i++){
							notFound = !($value.is(instance.validation.inputTypes[i]) );
							inputType = i;
						}
						var notFilled = false;
						switch (inputType){
						case 0:
							var radioName = $value.attr('name');
							if ($('input[type=radio][name='+radioName+']:checked').length === 0){
								//notFilled = true;
								errorsList.push($value.parents('.divacc').attr('id'));
							}
							requiredList = $.grep( requiredList, function(element, i){
								return $(element).attr('name') !== radioName;
							});
							
						break;
						case 1:
						case 2:
							if ($.trim($value.val()).length === 0){
								errorsList.push($value.attr('id'));
								//notFilled = true;
							}
							requiredList = requiredList.splice(1);
						break;
						
						}
						
						
					}
					return errorsList;
					
					//console.log( errorsList);
				},
				checkPatterns: function(){
					var errorsList 		= [];
					var elementsList 	= $(instance.validation.inputTypes[1] + ',' +
						instance.validation.inputTypes[2], '#container');
					elementsList.each(function(index, value){
						var $value = $(value);
						var patternRegExp = new RegExp(instance.validation.patternsHash[$value.attr('id')]);
						if ( !patternRegExp.test($value.val()) ){
							errorsList.push( $value.attr('id') );
							
						}
					});
					
					
					
				}
			}
				
				
			
		}
	}
	var instance;
	return {
		//get instance
		getInstance: function(){
			if (instance == null) {
				instance = new model();
				// Hide the constructor so the returned objected can't be new'd...
				instance.constructor = null;
				//instance.init();
			}
			return instance;
		}
	};
	
})();