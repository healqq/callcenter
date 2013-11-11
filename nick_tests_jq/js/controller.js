//Начинаем приводить код к MVC
//модель
var  controller = (function(){
    function controller() {
	//private
	var	events = [];
	var addEventToElement = ( function( eventsList, eventName, handler){
		var notFound = true;
		for( var i=0; i< eventsList.length && notFound; i++ ){
			if (eventsList[i].eventName === eventName ){
				notFound = false;
				
			}
		}
		var newEvent = {eventName: eventName,
			handler: handler
		}
			//добавляем элемент, если не нашли или если хэндлер не совпадает
		if (notFound )
			eventsList.push(newEvent);
		else{
			
			if (eventsList[i].handler !== handler ){
			
				eventsList.push(newEvent);
			}
			else{
				return false;
			}
		}
		return true;
		
		
		
	});
	var removeEventFromElement = ( function( eventsList, eventName){
			
		
	});
		
		//public
		return{
			
			addEvent: function(element, eventName, handler){
				if (element === undefined)
					return;
				var notFound = true;
				for( var i=0; i< events.length && notFound; i++ ){
					if (events[i].element === element ){
						notFound = false;
					}
				}
				//заносим в список новый элемент
				if (notFound){
					events.push({element:element,list:[]});
				}
				if (addEventToElement( events[i].list, eventName, handler) ){
					$(element).on(eventName, handler);
				}
				
			},
			clearEvents: function(element, eventsName){
				if (element === undefined)
					return;
				var notFound = true;
				for( var i=0; i< events.length && notFound; i++ ){
					if (events[i].element === element ){
						notFound = false;
					}
				}
				if (notFound){
				}
				else{
					//если не передан список евентов - удаляем все
					if (eventsName === undefined){
						events[i].list = [];
					}
					//todo удалить отдельный евент
					else{
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
				instance = new controller();
				// Hide the constructor so the returned objected can't be new'd...
				instance.constructor = null;
				//instance.init();
			}
			return instance;
		}
	};
	
})();