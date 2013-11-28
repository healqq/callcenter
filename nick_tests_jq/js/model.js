//Начинаем приводить код к MVC
//модель
var model = (function(){
    function model() {
	//private
		var lastid = 0;
		var state ={ element_edit:'new',
					display_view:'controls'// state используется для контроля пользователя и получения данных
					};						// о текущем состоянии ( варианты 'new', 'edit' )
		var statesList = {
			element_edit:['new', 'edit'],
			display_view:['controls', 'scheeme']
		}
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
				setCookie('settings', JSON.stringify(settings), {expires:24*60*60*365,path:'/'});
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
					view.getInstance().buttonsAnimation();
					control.addEvent($("#btnLoadStructure"),'click', function(){loadStructure(true)});
					control.addEvent($('#close-errors'), 'click', clearErrors);
				}
				else{
				
				
					
					loadStructure(false);
					control.addEvent($("#btnLoadStructure"),'click',function(){ loadStructure(false) });
					control.addEvent($("#btnSendData"),'click', sendData);
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
				control.addEvent($("#logout"), 'click', logout);
				view.getInstance().buttonsAnimation();
	
			},
			setRadioValue: function(element, index){
				var indexedElement = $($(element).find(':input[type=radio]')[index]);
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