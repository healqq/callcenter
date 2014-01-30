//Начинаем приводить код к MVC
//модель
var model = (function(){
    function model() {
	//private
		var lastid = 0;
		var prevElement = undefined;
		var syncMap = {};
		var state ={ element_edit:'new',
					display_view:'controls',
					scroll_top_btn: 'off'	// state используется для контроля пользователя и получения данных
					};						// о текущем состоянии ( варианты 'new', 'edit' )
		var statesList = {
			element_edit:['new', 'edit'],
			display_view:['controls', 'scheeme'],
			scroll_top_btn:['on', 'off']
		}
		var helpContents = [
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
		var currentPage = undefined;
		//public
		return{
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
				saveSettings: function(){
				var autosave = $('#autosave').prop('checked');
				var autofillID = $('#elementNameAutofill').prop('checked');
				var settings = {'autosave': autosave,
								'autofillID': autofillID
								};
				setCookie('settings', JSON.stringify(settings), {expires:24*60*60*365,path:'/Callcenter'});
				$('#temp_divs').data('autofillID', settings.autofillID);
				
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
									'autofillID': false
									};
							//showError('Unable to load settings');
							
						}
						var autosaveItem = $('#autosave');
						var autofillItem = $('#elementNameAutofill');
						autosaveItem.prop('checked', savedSettingsObj.autosave);
						//записываем параметр для использования чтобы не дергать печеньки
						$('#temp_divs').data('autofillID', savedSettingsObj.autofillID);
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
					view.getInstance().hideSyncBlock();
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
					control.addEvent($("#btnSaveSyncMap"),'click', instance.api.saveSyncMap);
					
					
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
					control.addEvent($("#btnShowHelp"), 'click', instance.galleryActions.initGallery);
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
								retValue = activeBlock;
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
					console.log(element);
					var branches = $element.data('branches');
					console.log(instance.blockActions.hasBranches(branches));
					if (instance.blockActions.hasBranches(branches)){
						//нельзя удалить элемент с ветвями 
						return false;
					}
					else{
						var prevElem = $element.prev();
						var nextElem = $element.next();
						var prevElemBranches = prevElem.data('branches');
						//var nextElemBranches = nextElem.data('branches');
						
						//варианты
						//первый элемент:
						//просто удаляем его, изменений в других элементах не будет,
						//но нужна перерисовка
						if (prevElem.length === 0 ){
							firstElement = ( branches === undefined?undefined:branches[0]);
							removeElement($element);
							showBranch(firstElement, false);
							
							
							
						}
						else
							//последний элемент
							//очищаем ветвь у предыдущего элемента и всё
							if (nextElem.length === 0){
								prevElemBranches[prevElemBranches.indexOf($element.attr('id'))] = '';
								//prevElemBranches = ( (prevElemBranches.length === 1) ? undefined : prevElemBranches);
								removeElement(element);
								if (prevElemBranches.length === 1){
									prevElem.removeData('branches');
									
								}
								else{
									prevElem.data('branches', prevElemBranches);
								}
								
							}
							//элемент в серединке.
							//предыдущему вставляем в ветвь следующий
							else{
								prevElemBranches[prevElemBranches.indexOf($element.attr('id'))] = branches[0];
								removeElement(element);
								prevElem.data('branches', prevElemBranches);
								
								
							}
						
						
						redraw();
						view.getInstance().showWarning('Элемент был удален. Нажмите, чтобы отменить удаление.', instance.blockActions.restoreStructure);
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
					var JSONstructure = exportToJSON(["#container","#imported"]);
					$('#container').data('structure', JSONstructure);
				},
				restoreStructure: function(){
					var savedStruct = $('#container').data('structure');
					if (savedStruct !== undefined){
						first = importFromJSON( savedStruct, "#imported", true);
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
				allElementsCircuit: function ( element, func){
					
					func(element);
					$(element.data('branches')).each(function(index, value){
						var nextElement = $('#'+value);
						if ( ! (nextElement.length === 0 ) ){
							instance.blockActions.allElementsCircuit (nextElement, func);
						}
					});
				}
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
				initGallery: function(){
				//init nav
				//инит делается 1 раз, затем просто show/hide
					if (currentPage === undefined){
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
						controllerInst.addEvent($('#gallery-exit'), 'click', function() { $('.wrapper').hide();});
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
					$('.wrapper').show();
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