//Начинаем приводить код к MVC
//модель
var  controller = (function(){
    function controller() {
	//private
	var	events = [];
	
	var addEventToElement = ( function( eventsList, eventName, handler){
		var notFound = true;
		var event = undefined;
		for( var i=0; i< eventsList.length && notFound; i++ ){
			if (eventsList[i].eventName === eventName ){
				notFound = false;
				event = eventsList[i];
				
			}
		}
		var newEvent = {eventName: eventName,
			handler: handler
		}
			//добавляем элемент, если не нашли или если хэндлер не совпадает
		if (notFound )
			eventsList.push(newEvent);
		else{
			
			if (event .handler !== handler ){
			
				eventsList.push(newEvent);
			}
			else{
				return false;
			}
		}
		return true;
		
		
		
	});
	var removeEventFromElement = ( function(element, eventElement){
		//element.off(eventElement
		
			
		
	});
		
		//public
		return{
			
			addEvent: function(element, eventName, handler){
				if (element === undefined)
					return;
				var notFound = true;
				var matchedElement = undefined;
				for( var i=0; i< events.length && notFound; i++ ){
					if (events[i].element[0] === element[0] ){
						notFound = false;
						matchedElement  = events[i];
					}
				}
				
				//заносим в список новый элемент
				if (notFound){
					events.push({element:element,list:[]});
					matchedElement = events[events.length-1];
				}
				if (addEventToElement( matchedElement.list, eventName, handler) ){
					console.log($(element)[0] + ' ' + handler + ' + ');
					$(element).on(eventName, handler);
				}
				
			},
			clearEvents: function(element, eventsName){
				if (element === undefined)
					return;
				var notFound = true;
				var matchedElement = undefined;
				for( var i=0; i< events.length && notFound; i++ ){
					if (events[i].element[0] === element[0] ){
						notFound = false;
						matchedElement  = events[i];
					}
				}
				if (notFound){
				}
				else{
					//если не передан список евентов - удаляем все
					if (eventsName === undefined){
						matchedElement.list = [];
						$(element).off();
						console.log($(element)[0]  + ' - ');
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