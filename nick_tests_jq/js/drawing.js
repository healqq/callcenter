
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
	var blockWidth = 30;
	var blockHeight = 30;
	var spaceCoff = 0.5;
	
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
		}
		
		//if (element == "")
		//	return;
		
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
		instance.addItem(element, column, row);
		if ( nextElements == undefined )
		//конец ветки
			return;
		var step = (function (nextElements, row,  column){
			for (var i=0; i< nextElements.length; i++){
				
				//рисуем линию и следующий элемент
				options.rowComputed = instance.getMaxRow() + ( (i == 0)?0:1);
				if (nextElements[i] !== "" ){
					drawElement( "line", options);
					drawNext(nextElements[i], options.rowComputed , options.column+1);
				}
			}
		});
		step(nextElements, row, column);
						
			
		
	});
	
	var drawElement =( function ( type,options)/* row, column, spaceCoff, blockWidth, blockHeight)*/{
		//var globalShift = 5;
		switch (type){
			case "circle":
				ctx.fillStyle = "red";
				ctx.strokeStyle = (options.notFilled? "red": "black"); 
					
								
				ctx.beginPath();

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
				ctx.fillStyle = "blue";
				var linearGradient = ctx.createLinearGradient((options.row)*(1+options.spaceCoff)*options.blockWidth,
															options.column*(1+options.spaceCoff)*options.blockHeight,
															(1 + options.row*(1+options.spaceCoff) )*options.blockWidth,
															(1 + options.column*(1+options.spaceCoff) )*options.blockHeight);
				linearGradient.addColorStop(0, '#00ABEB');
			//	linearGradient.addColorStop(0.5, '#fff');
			//	linearGradient.addColorStop(0.5, '#26C000');
				linearGradient.addColorStop(1, '#fff');
				ctx.fillStyle = linearGradient;
				ctx.strokeRect((options.row)*(1+options.spaceCoff)*options.blockWidth,
					options.column*(1+options.spaceCoff)*options.blockHeight,
					options.blockWidth,
					options.blockHeight);
			break;
			case "line":
				ctx.lineWidth = 1;
				ctx.lineCap = "round";
				ctx.beginPath();
				ctx.moveTo( (options.row*(1+options.spaceCoff) + options.spaceCoff )*options.blockWidth  ,
					(1 + options.column*(1+options.spaceCoff) )*options.blockHeight);
				ctx.lineTo(( ( options.rowComputed )*(1+options.spaceCoff) + options.spaceCoff )*options.blockWidth,
					((options.column+1)*(1+options.spaceCoff) )*options.blockHeight);
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
		var rows 	= (mouseX  ) /( blockWidth*(1+2*spaceCoff) );
		var columns = (mouseY  ) /( blockHeight*(1+2*spaceCoff) );
		var blockSize = blockWidth / ( blockWidth*(1+2*spaceCoff) );
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
		$("#scheeme-id").empty();
		$("#scheeme-id").append(text);
		
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
				canvas.addEventListener("click",mouseclick);
				
				
				return this;
			}
		return undefined;
		},
		scale: function(ratio){
			ctx.scale(ratio, ratio);
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
			idParagraph.append("id: " + id);
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
            }
            return instance;
        }
	};
})();

