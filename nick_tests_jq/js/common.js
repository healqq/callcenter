function fabric ( type,  options) {
	//var mainElement = $(container);
	var newElement;
	var newElementType;
	var newElementId;
	//неправильно указан контейнер
	//if (mainElement.size() == 0) {
	//	return undefined;
	//}
	elementContent = '';
	//проверяем, что нет элемента с таким id
	newElementId =  options.id;
	if ( !(newElementId == undefined) ) {
		if ( !($('#+options.id').size() == 0 ) ){
			return;
		}
	}
	//получаем данные, которые вставим внутрь элемента
	elementInnerData = (options.content == undefined)? "": options.content;
	switch ( type ) {
		case "div":
			elementContent = '<div>' + elementInnerData + '</div>'; break;
		case "p":
			elementContent = '<p>' + elementInnerData + '</p>'; break;
		case "h3":
			elementContent = '<h3>' + elementInnerData + '</h3>'; break;
		case "text area":
			elementContent = '<textarea>' + elementInnerData + '</textarea>'; break;
		case "radio":
			break;
		case "checkbox":
			break;
			
		
			
		 default:
			return undefined;
			break;
	}
	//создаем элемент
	newElement = $(elementContent);
	//добавляем параметры
	if ( !(options.class == undefined) ) {
		newElement.attr("class", options.class);
	}
	if ( !(newElementId == undefined) ) {
		newElement.attr("id", options.id);
	}
	//newElement.appendTo(mainElement);
	return newElement;
}
//сворачивание/разворачивание при клике на заголовок
function onHeaderClick(){
		var that = $(this);
		that.siblings().slideToggle("slow");
		var div_block = that.parent("div");
		div_block.siblings().not(div_block).children().not("h3").slideUp("slow");
		
		that.toggleClass("active");
		that.siblings("h3").removeClass("active");
	}
//событие при изменении инпута
//переходит на следующее сообщение, если такое есть.
//иначе просто сворачивает текущее	
function onTextChanged() {
		var div_block = $(this).parent("div");
		var new_div_block = div_block.next();
		if (new_div_block.size() == 0 ){
			//div_block.
			div_block.children().not("h3").slideUp("slow");
		}
		else{
			new_div_block.children("h3:first").trigger("click");
		}
	}