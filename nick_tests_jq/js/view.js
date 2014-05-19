//Начинаем приводить код к MVC
//модель
var  view = (function(){
    function view() {
	//private
	//var	events = [];
	
	
	
	//var removeEventFromElement = ( function( eventsList, eventName){
			
		
	//});
		
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
				$('label[for='+$(element).find(':checked').attr('id')+']').addClass("active-checkBoxLabel");
				
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
			scrollToTop: function(evt, value){
				var scrollValue = ( (value === undefined)? 125: value);
				$('body').animate({scrollTop:scrollValue},{duration:'slow'});
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
			fillSyncContainer: function(){
			//очистка
				$('.sync-help.warning', '#sync-container').remove(); 
				$('.summary-element', '#sync-container').remove();
				$('.btnSaveSyncMap').parent().hide();
				
				var modelApi = model.getInstance().api;
				var syncMap = modelApi.getSyncMap();
				var index = 0;
				/*try to fill*/
				syncMap = modelApi.fillSyncMap();
				if ($.isEmptyObject( syncMap ) ){
					var warningDiv = fabric('div', getObjectSpecs('sync-warning', 
						'Похоже нет ни одного блока,заполните скрипт прежде чем задавать соответствие элементов!') );
					$('#sync-container').append(warningDiv);
					return;
				}
				else{
					$('.help-annotation.warning').remove();
				}
				$('.btnSaveSyncMap').parent().show();	
				for (var key in syncMap){
					index++;
		//			var element = $('#'+key);
					var newBlock = fabric('div', getObjectSpecs('summary-element') );
					newBlock.data('id', key);
					//раскраска цветом
					if ((index % 2) === 0 ){
						newBlock.addClass('odd');
					}
					var newNameBlock = fabric('div', getObjectSpecs('summary-element-name') );
					var newValueBlock = fabric('div', getObjectSpecs('summary-element-value') );
					var newNameParagraph = fabric('p', getObjectSpecs('summary-element-name-p', 
						$('#'+syncMap[key].id).children('h3').children('span:first').text() ) );
					newNameBlock.appendTo(newBlock);
					newNameParagraph.appendTo(newNameBlock);
					
					newValueBlock.appendTo(newBlock);
					
		//		var values = getInputValueArray(element, "sync");
					//todo
					//change to normal code
		//			for (var i=0; i< values.length; i++ ){
						var newValueNameSpan = fabric('p', getObjectSpecs('summary-element-valuename', key ) );
						//var value = '<span style="float: left; width: 200px; height: 100%">'+values[i].key + ': </span>' ;
						var newValueValueSpan = fabric('text edit', getObjectSpecs('summary-element-valuevalue',syncMap[key].value) );
						
						
						var newValueParagraph = fabric('div', getObjectSpecs('summary-element-value-p') );
				//		if ( (values[i].value === undefined) || (values[i].value == '') ){
							//todo indication unfilled
							//newValueBlock.addClass('not-filled');
				//		}
						newValueNameSpan.appendTo( newValueParagraph);
						newValueValueSpan.appendTo( newValueParagraph);
						newValueParagraph.appendTo(newValueBlock);
						
		//			}
				//	$('.sync-help').append(newBlock);
					newBlock.insertAfter($('.top-button'));
				
					
				}
				
			},
			showSyncBlock: function(){
				instance.fillSyncContainer();
				$('#scheeme-help-layer').show();
				$('#sync-block-wrap').slideDown({duration:'slow', complete:function(){
						var exit = $('.exit-small__div.sync-exit').slideDown('fast');
						controller.getInstance().addEvent($('#sync-exit'), 'click', instance.hideSyncBlock);
					}
				});
			},
			hideSyncBlock: function(){
				$('.exit-small__div.sync-exit').slideUp('fast');
				$('#sync-block-wrap').slideUp({duration:'slow', complete:function(){
						$('#scheeme-help-layer').hide();
					}
				});
			},
			showScrollTopButton: function(){
				$('.scroll-to-top').animate({bottom:"+=50", opacity: "show"}, "slow");
			},
			hideScrollTopButton: function(){
				$('.scroll-to-top').animate({bottom:"-=50", opacity: "hide"}, "slow");
			},
			showPrintBlock: function(){
				model.getInstance().api.fillPrintBlock();
				$('#scheeme-help-layer').show();
				$('#print-block-wrap').slideDown({duration:'slow', complete:function(){
						var exit = $('.exit-small__div.print-exit').slideDown('fast');
						controller.getInstance().addEvent($('#print-exit'), 'click', instance.hidePrintBlock);
					}
				});
					
			},
			hidePrintBlock: function(){
				$('.exit-small__div.print-exit').slideUp('fast');
				$('#print-block-wrap').slideUp({duration:'slow', complete:function(){
						$('#scheeme-help-layer').hide();
					}
				});
			},
			addElementToPrintBlock: function( element, level){
				var newBlockWrap = fabric('div', getObjectSpecs('print-element-wrap') );
				var newBlock = fabric('div', getObjectSpecs('print-element') );
				
				var newNameP = fabric('p', getObjectSpecs('print-element-name', "<strong>Имя блока: </strong>" + element.header) );
				var newDescP = fabric('p', getObjectSpecs('print-element-desc') );
				model.getInstance().setHTML(newDescP,"<strong>Описание: </strong>" + element.description);
				newNameP.appendTo(newBlock);
				newDescP.appendTo(newBlock);
				var inputTypeStr = '';
				//var newInputTypeP = fabric('p', getObjectSpecs('print-element-input-type', element.inputType) );
				switch( element.inputType){
					case 'radio':
						for (var i=0; i< element.radio.length; i++){
							var newInput = fabric('p', getObjectSpecs('print-element-input-value', element.radio[i]) );
							newInput.appendTo( newBlock );
							
						}
						inputTypeStr = 'перечисление';
						break;
					case 'textarea':
						inputTypeStr = 'Текстовое поле';
						break;
					case 'text':
						for (var i=0; i< element.fieldsList.length; i++){
							var newInput = fabric('p', getObjectSpecs('print-element-input-value', element.fieldsList[i].value) );
							newInput.appendTo( newBlock );
							
						}
						
						break;
						
				}
				var newInputTypeP = fabric('p', getObjectSpecs('print-element-input-type','<strong>Вид ответа: </strong>' + inputTypeStr) );
				newInputTypeP.insertAfter(newDescP);
				newBlockWrap.appendTo($('#print-container'));
				newBlock.css('left', 50* level + 'px');
				newBlock.css('padding-right', 50* level + 'px');
				newBlock.appendTo(newBlockWrap);
				
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