//Начинаем приводить код к MVC
//модель
var model = (function(){
    function model() {
	//private
		var lastid = 0;
		
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
				
			}
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
					}
					
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