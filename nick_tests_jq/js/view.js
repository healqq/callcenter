//Начинаем приводить код к MVC
//модель
var  view = (function(){
    function view() {
	//private
	var	events = [];
	
	
	var removeEventFromElement = ( function( eventsList, eventName){
			
		
	});
		
		//public
		return{
			
			buttonsAnimation: function(element){
				element = ( (element == undefined) ? document: element);
				var control = controller.getInstance();
				$(element).find('.control-button, .editbuttonAccordion, #goto-elem, #revert').each(function(){
					control.addEvent($(this),'mousedown', function(){$(this).addClass('click')});
					control.addEvent($(this),'mouseup', function(){$(this).removeClass('click')});
					
				
				});
				
				control.addEvent($(document), 'mouseup', function(){
					$('.control-button,.editbuttonAccordion, #goto-elem ,#revert' ).each(function(){
						$(this).removeClass('click');
					});
					
				});
				
			},
			showWarning: function(warningString){
				$('#warning-paragraph').text(warningString);
				$('#warning-block').slideDown({duration: 'slow', complete:function(){
					controller.getInstance().addEvent($('#revert'),'click',function(){
						instance.hideWarning();
						reloadStructure();
						});
				controller.getInstance().addEvent($('#warning-exit-btn'), 'click', instance.hideWarning);
					
					}
				});
			},
			hideWarning: function(){
				$('#warning-block').slideUp({duration: 'slow', complete:function(){
						$('#warning-paragraph').empty();
					}
				
				});
			}
		
		
		}
	}
	var instance;
	return {
		//get instance
		getInstance: function(){
			if (instance == null) {
				instance = new view();
				// Hide the constructor so the returned objected can't be new'd...
				instance.constructor = null;
				//instance.init();
			}
			return instance;
		}
	};
	
})();