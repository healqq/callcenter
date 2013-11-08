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
			return lastid;
	},
		//saves settings to cookies
		saveSettings: function(){
			var autosave = $('#autosave').prop('checked');
			var autofillID = $('#elementNameAutoFill').prop('checked');
			setCookie('settings', JSON.stringify({'autosave': autosave, 'autofillID': autofillID}), {expires:24*60*60*365,path:'/'});
			
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