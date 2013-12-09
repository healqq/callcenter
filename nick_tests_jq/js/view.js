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
			showWarning: function(warningString, clickEvent){
				$('#warning-paragraph').text(warningString);
				$('#warning-block').slideDown({duration: 'slow', complete:function(){
					controller.getInstance().addEvent($('#revert'),'click',function(){
						instance.hideWarning();
						clickEvent();
						});
				controller.getInstance().addEvent($('#warning-exit-btn'), 'click', instance.hideWarning);
					
					}
				});
			},
			hideWarning: function(){
				$('#warning-block').slideUp({duration: 'slow', complete:function(){
						//$('#warning-paragraph').empty();
					}
				
				});
			},
			addLabelsAnimation: function(element, index){
				$(element).find(':input').each(function(){
					$('label[for='+$(this).attr('id')+']').removeClass("active-checkBoxLabel");
				});
				$('label[for='+$($(element).find(':checked')).attr('id')+']').addClass("active-checkBoxLabel");
				
			},
			//active-unactive
			toggleElementState: function( element, state){
				if (state === undefined){
					$(element).toggleClass('inactive');
					return;
				}
				if (state){
					$(element).removeClass('inactive');
					//$(element).add
				}
				else{
					$(element).addClass('inactive');
				}
				
			},
			//Скроллим вверх при нажатии на edit/copy(+animation)
			scrollToTop: function(elem, scrollValue){
				scrollValue = ( (scrollValue === undefined) ? 137 : scrollValue);
				var $elem = $(elem);
				console.log(scrollValue);
				console.log($elem);
				$elem.animate({scrollTop:scrollValue +'px'},{duration:'fast'});
			},
			toggleControlButtonsState: function(state){
				$('.editbuttonAccordion').each( function(){
					instance.toggleElementState($(this), state);
				});
			},
			focusElement: function (element, type){
				if (! (element == undefined) ){
					jElement = $(element);
					if ( jElement.is("div") ){
						jElement.addClass(type == "focus"?"focused":"not-filled");
					}
					else
						jElement.focus();
					
				}
					
			},
			clearUnfilled: function (){
					$('.not-filled').each(function(){
							$(this).removeClass('not-filled');
						});
				},
			
			
		
		
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