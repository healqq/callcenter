
//Синглтон для рисования дерева
//очень крутой.
var drawerSingleton = (function(){
    function drawerSingleton() {
	//private
	
	var itemsArray ;
	var ctx ;
	var maxRow;
	var maxColumn;
	var canvas;
	var blockWidth = 40;
	var blockHeight = 40;
	var spaceCoff = 0.5;
	var blockSize = blockWidth *(1 +  spaceCoff);
	
	//draw element 
	var drawNext = ( function( element, row, column){
	//все данные для рисования храним тут
		var options = {
			"blockWidth":  blockWidth,
			"blockHeight": blockHeight,
			"spaceCoff": spaceCoff,
			"row": row,
			"column": column,
			"rowComputed": undefined,
			"branchesSize": undefined,
			"notFilled": false,
			"currentElement": false
		};
		var pseudoElement = (element.search(':') !== -1);
		var nextElements = undefined;
		var activeID = undefined;
		var activeElement = $('.active_header');
		if (activeElement.length !== 0){
			activeID = $('.active_header').parent().attr('id');
		}	
		options.currentElement = ( activeID == element);
		
		
		//незаполненный элемент используется только для отображения
		if (pseudoElement){
				options.notFilled = true;
				drawElement("square", options);
				
		}
		else{
			nextElements = $('#'+element).data('branches');
			if ( (nextElements !== undefined) && (nextElements.length > 1) ){
				options.branchesSize = nextElements.length;
				//это развилка, бахаем круг
				$(nextElements).each(function(){
					if (this == "" ){
						//eсли ветвей меньше чем вариантов - делаем красным
						options.notFilled = true;
					}
				});
				drawElement("circle", options);
			}
			else{
				
				//рисуем квадрат
				drawElement("square", options);
			} 
		}
		instance.addItem(element, column, row);
		if ( nextElements == undefined )
		//конец ветки
			return;
		var step = (function (nextElements, row,  column){
			for (var i=0; i< nextElements.length; i++){
				
				//рисуем линию и следующий элемент
				options.rowComputed = instance.getMaxRow() + ( (i == 0)?0:1);
				
				//resize canvas
				resizeCanvas(options.rowComputed, options.column+1);
				//if (canvas.options.rowComputed *blockSize 
				if (nextElements[i] == "" ){
					elementId =element +':'+i;
				}
				else{
					elementId = nextElements[i];
				}
				drawNext(elementId, options.rowComputed , options.column+1);
				drawElement( "line", options);
			}
		});
		step(nextElements, row, column);
						
			
		
	});
	var resizeCanvas 	= ( function(rows, columns){
	var canvasElement 	= $(canvas);
	var oldCanvas = undefined;
		var resizeWidth =  ( (parseInt( canvasElement.css('width') ) - rows * blockSize ) < blockSize ) ;
		var resizeHeight = ( (parseInt( canvasElement.css('height') ) - columns * blockSize ) < blockSize ) ; 
		var widthBefore, widthAfter, heightBefore, heightAfter;
		if  ( resizeWidth || resizeHeight ){
			//resizing
			
/*			widthBefore =  parseInt( canvasElement.css('width') );
			heightBefore =  parseInt( canvasElement.css('height') );
			widthAfter  = widthBefore + (resizeWidth?1 : 0 ) *  blockSize;
			heightAfter = heightBefore + (resizeHeight?1 : 0 ) * blockSize;*/
			/*ctx.scale( widthAfter/widthBefore, heightAfter/heightBefore);*/
			//ctx.scale(1,1);
			oldCanvas = canvas.toDataURL("image/png"); //saving canvas 
		/*	canvasElement.css('width', '+='+ (resizeWidth?1 : 0 ) *  blockSize+'px' );
			canvasElement.css('height', '+='+ (resizeHeight?1 : 0 ) * blockSize+'px') ;*/
			canvas.height += (resizeHeight?1 : 0 ) * blockSize;
			canvas.width += (resizeWidth?1 : 0 ) * blockSize;
		//	ctx.scale( parseInt( canvasElement.css('width') )/widthBefore, parseInt( canvasElement.css('height') )/heightBefore); 
			//canvas.height += (resizeHeight?1 : 0 ) * 2 * blockSize;
			
			var img = new Image();
			img.src = oldCanvas;
			img.onload = function (){
				ctx.drawImage(img, 0, 0);
			};
		//	ctx.scale(1,1);
			
		}
			//alert("time to resize!");
			
		
	});
	//рисуем элементы
	var drawElement =( function ( type,options){
		//var globalShift = 5;
		ctx.strokeStyle = (options.notFilled? "red": "black"); 
		var grd = ctx.createRadialGradient(
					options.row* (1+options.spaceCoff) * options.blockWidth /*inner*/
					,options.column*(1+options.spaceCoff) * options.blockWidth,
					5,
					options.row*(1+options.spaceCoff) * options.blockWidth,	/*outer*/
					options.column*(1+options.spaceCoff) * options.blockWidth,
					50);
				grd.addColorStop(0,"#63B8FF");	/*inner FFD700 blue: #4F94CD, #1874CD green: #00DF7A, #32CD32*/
				grd.addColorStop(1,'#4F94CD');
		
		switch (type){
			case "circle":
				
				
				if (options.currentElement){
					ctx.fillStyle = grd;
					ctx.beginPath();

					ctx.arc(  ( 0.5 + (options.row) * (1+options.spaceCoff) ) * options.blockWidth,
						(0.5 + options.column*(1+options.spaceCoff) )*options.blockHeight, 
						options.spaceCoff * options.blockWidth,0,
						2*Math.PI);
					ctx.fill();
				}
								
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.arc(  ( 0.5 + (options.row) * (1+options.spaceCoff) ) * options.blockWidth,
					(0.5 + options.column*(1+options.spaceCoff) )*options.blockHeight, 
					options.spaceCoff * options.blockWidth,0,
					2*Math.PI);
				ctx.stroke();
				//количество ветвей
				ctx.font = "14pt Calibri";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "Black";
			//	var xShift = ( (options.branchesSize>9)?0.2:0.25 );
			//	var yShift = 0.6;
				ctx.fillText(''+options.branchesSize,
					(0.5 + (options.row)  * (1+options.spaceCoff)) * options.blockWidth,
					(0.5  +  options.column*(1+options.spaceCoff) )*options.blockHeight);
			break;
			case "square":
				//ctx.fillStyle = "blue";
			/*	var linearGradient = ctx.createLinearGradient((options.row)*(1+options.spaceCoff)*options.blockWidth,
															options.column*(1+options.spaceCoff)*options.blockHeight,
															(1 + options.row*(1+options.spaceCoff) )*options.blockWidth,
															(1 + options.column*(1+options.spaceCoff) )*options.blockHeight);
				linearGradient.addColorStop(0, '#00ABEB');
			//	linearGradient.addColorStop(0.5, '#fff');
			//	linearGradient.addColorStop(0.5, '#26C000');
				linearGradient.addColorStop(1, '#fff');
				ctx.fillStyle = linearGradient;*/
				
				
				
				if (options.currentElement){
					ctx.fillStyle = grd;
					ctx.fillRect((options.row)*(1+options.spaceCoff)*options.blockWidth,
						options.column*(1+options.spaceCoff)*options.blockHeight,
						options.blockWidth,
						options.blockHeight);	
				}
				ctx.lineWidth = 2;
				ctx.strokeRect((options.row)*(1+options.spaceCoff)*options.blockWidth,
					options.column*(1+options.spaceCoff)*options.blockHeight,
					options.blockWidth,
					options.blockHeight);
			break;
			case "line":
				ctx.lineWidth = 1;
				ctx.lineCap = "round";
				ctx.beginPath();
				
				var startX  = (options.row*(1+options.spaceCoff) + options.spaceCoff )*options.blockWidth + 0.5;
				var startY  = (1 + options.column*(1+options.spaceCoff) )*options.blockHeight;
				var finishX = ( ( options.rowComputed )*(1+options.spaceCoff) + options.spaceCoff )*options.blockWidth + 0.5;
				var finishY = ((options.column+1)*(1+options.spaceCoff) )*options.blockHeight;
				ctx.moveTo( startX  ,startY );
				if (options.row == options.rowComputed){
					ctx.lineTo( finishX, finishY);
				
				}
				else{
					//var coff = (options.rowComputed - options.row) * (options.rowComputed - options.row)/ 
					//options.rowComputed/options.rowComputed;
					var coff = (options.rowComputed - options.row)/options.rowComputed;
					ctx.bezierCurveTo( 
					/*start*/
						startX,finishY ,
						finishX,startY,
					/*finish*/finishX,finishY);
				}
				ctx.stroke();
			break;
		}
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		
		
	});
	var mouseclick = ( function(evt) {
		var text = "";
		var mouseX 	= evt.pageX - canvas.offsetLeft;
		var mouseY 	= evt.pageY - canvas.offsetTop;
		var rows 	= (mouseX  ) /( blockWidth*(1+spaceCoff) );
		var columns = (mouseY  ) /( blockHeight*(1+spaceCoff) );
		var blockSize = blockWidth / ( blockWidth*(1+spaceCoff) );
		var row 	= Math.floor( rows );
		var nothing = false;
		var column 	= Math.floor( columns);
		if ( ( (rows - Math.floor(rows) ) > blockSize ) || (columns - Math.floor(columns) > blockSize) )
			nothing = true;
			//return;
		
		//if (columns - Math.floor(columns) > blockHeight)
			//return;
		/*var rowTop = Math.floor( (mouseX  ) /( blockWidth*(1+2*spaceCoff) )  );
		var rowBot = Math.ceil( (mouseX  ) /( blockWidth*(2+2*spaceCoff) )  );
		var columnTop = Math.floor( (mouseY  ) /( blockHeight*(1+2*spaceCoff) ) );
		var columnBot = Math.ceil( (mouseY  ) /( blockHeight*(2+2*spaceCoff) )  );*/
		if ( !nothing ){
			text = "Координаты "+row+":"+column + "<br>"; 
			
			for (var i = 0; i < itemsArray.length; i++ ){
				if ( (itemsArray[i].column == column) && (itemsArray[i].row == row) ) {
					text = "id: " + itemsArray[i].id;
					id = itemsArray[i].id;
					instance.showCanvasHelp( id , evt.clientX, evt.clientY);
					$("#scheeme-exit").off('click').on('click', hideCanvasHelp);
					$("#goto-elem").off('click').on('click', function(){
						showElement( id );
						});
					break;
				}
			}
			
		}
		else{
			hideCanvasHelp();
			text = "miss";
		}
		$('#test-output').empty();
		$('#test-output').append(text);
	//	$("#scheeme-id").empty();
	//	$("#scheeme-id").append(text);
		
	});
	//public
	return{
		//adding info about div block
		addItem: (function(element, column, row){
			
			itemsArray.push({"id": element, 
							"column": column, 
							"row": row
							});
			if ( row > maxRow )
				maxRow = row;
			if (column > maxColumn)
				maxColumn = column;
			
		}),
		draw :  function (){
		//layer =( layer == undefined? 1, layer);
			element = $("#container").children().first().attr('id');
			//ctx.scale(0.25, 0.25);
			drawNext(element, 1, 1);
			//ctx.scale(0.5, 0.5);
			
			//do stuff
		},
		//init function
		init : function (){
			canvas = document.getElementById('scheeme')
			if (canvas.getContext){
				itemsArray = []; 
				ctx = canvas.getContext('2d');
				maxRow = 0;
				maxColumn = 1;
				canvas.height = 240;
				canvas.width = 240;
				canvas.addEventListener("click",mouseclick);
				
				
				return this;
			}
		return undefined;
		},
		clear: function(){
			canvas.width = canvas.width;
			maxRow = 0;
			maxColumn = 1;
			itemsArray = [];
		},
		//retuns array with div blocks info
		getArray: function(){
			return itemsArray;
		},
		//returns max row
		getMaxRow: function(){
			return maxRow;
		},
		//returns max column
		getMaxColumn: function(){
			return maxColumn;
		},
		showCanvasHelp: function(id,x,y){
			var canvasTop 	= canvas.offsetTop;
			var canvasLeft 	= canvas.offsetLeft;
			var divTop 		= canvasTop;
			var divLeft 	= canvasLeft;
			var helpDiv 	= $('#scheeme-help');
			var idParagraph = $('#scheeme-id');
			idParagraph.empty();
			if (id.search(':') !== -1 ){
				idParagraph.append("У элемента <strong>" + id.substr(0,id.search(':'))  + 
				"</strong> не заполнена ветвь номер <strong>" +
				( parseInt(id.substr(id.search(':')+1 ) ) + 1) +'</strong>.' );
			}
			else{
				idParagraph.append("<strong>id: </strong>" + id);
			}
			if (helpDiv.css("display") == "none" ){
				//переносим в угол
				helpDiv.css("left", canvasLeft+'px');
				helpDiv.css("top", canvasTop+'px');
				helpDiv.show();
				//$("#scheeme-exit").click(hideCanvasHelp);
				
			}
			else{
				divLeft = parseInt( helpDiv.css("left"));
				divTop  = parseInt( helpDiv.css("top"));
				
			}
			helpDiv.animate({left:'+='+(x - 200 - divLeft)+'px', top:'+='+(y-divTop)+'px'},"fast");
	//helpDiv.css("left", x+50+'px');
	//helpDiv.css("top", y+'px');
	
	
	
	
		}
	}
}
    var instance;
    return {
		//get instance
        getInstance: function(){
            if (instance == null) {
                instance = new drawerSingleton();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
				instance.init();
            }
            return instance;
        }
	};
})();

