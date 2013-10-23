
//Синглтон для рисования дерева
//очень крутой.
var drawerSingleton = (function(){
    function drawerSingleton() {
	//private
	var itemsArray ;
	var ctx ;
	var maxRow;
	var maxColumn;
	//draw element 
	var drawElement = ( function( element, row, column){
		if (element == "")
			return;
		else{
			ctx.fillStyle = "blue";
			 ctx.fillRect((row+instance.getMaxRow())*30,column*50,25,25);
			 instance.addItem(element, column, row);
			 nextElements = $('#'+element).data('branches');
			 if ( nextElements == undefined )
				return;
				var step = (function (nextElements, row,  column){
					for (var i=0; i< nextElements.length; i++){
						ctx.lineWidth = 2;
						ctx.beginPath();
						ctx.moveTo((row)*30 + 13,column*50+ 25);
						ctx.lineTo((row+instance.getMaxRow()+i)*30 +13 ,(column+1)*50);
						ctx.stroke();
					drawElement(nextElements[i], row + i, column+1);
					}
				});
				step(nextElements, row, column);
			 }
				
			
		
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
			drawElement(element, 0, 1);
			
			//do stuff
		},
		//init function
		init : function (){
			var canvas = document.getElementById('scheeme');
			if (canvas.getContext){
				itemsArray = []; 
				ctx = canvas.getContext('2d');
				maxRow = 0;
				maxColumn = 1;
				return this;
			}
		return undefined;
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

