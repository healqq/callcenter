//Начинаем приводить код к MVC
//модель
var model = (function(){
    function model() {
	//private
		var lastid = 0;
		var state = 'new';	// state используется для контроля пользователя и получения данных
							// о текущем состоянии ( варианты 'new', 'edit' )
		
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
					controller.getInstance().addEvent($('#autosave')[0], 'change', instance.saveSettings);
					
					if (autofillItem.length > 0 ){
						autofillItem.prop('checked', savedSettingsObj.autofillID);
						controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change', instance.saveSettings);
						controller.getInstance().addEvent($('#elementNameAutofill')[0], 'change',  instance.autofillIDClick);
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
				state = type;
				
			},
			getState: function(){
				return state;
			},
			isEdited: function(){
				return (state === 'edit');
			},
			onStart: function(){
				var control = controller.getInstance();
				control.addEvent($(window),'beforeunload',function(){
		
					return "Внимание! Вся несохранённая информация будет потеряна! ";
			
				});
				checkSession();
				instance.loadSettings();
				createNewTempElement();
				
			
				$("#container").data("sstype",true);
				control.addEvent($("#btnSaveStructure"),'click', function(){
						var r=confirm("Внимание! Старая версия анкеты будет заменена! Продолжить?");
						if (r==true)
						{
							
						}
						else
						{
							return;
						}
						saveStructure();
					});
				
				
				control.addEvent($("#sendXML"),'click', sendData);
				control.addEvent($("#logout"),'click', logout);
				control.addEvent($("#toggle-state-btn"),'click', switchTables);
				control.addEvent($("#scheeme-help-btn"),'click', showScheemeHelp);
				control.addEvent($("#scheeme-basic-exit"),'click', hideScheemeHelp);
				view.getInstance().buttonsAnimation();
				control.addEvent($("#btnLoadStructure"),'click', function(){loadStructure(true)});
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