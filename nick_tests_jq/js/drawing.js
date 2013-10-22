function draw(){
	//layer =( layer == undefined? 1, layer);
	$("#scheeme").attr("width", "500px");
	$("#canvas").attr("height", "400px");
	var canvas = document.getElementById('scheeme');
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
	 element = $("#container").children().first().attr('id');
	 drawElement(ctx, element, 1, 1);
	 
    
  }

}
function drawElement(ctx, element, row, column){
	if (element == "")
		return;
	else{
		//layer =( layer == undefined? 1, row, column);
		ctx.fillStyle = "blue";
		 ctx.fillRect(row*50,column*50,25,25);
		 nextElements = $('#'+element).data('branches');
		 if ( nextElements == undefined )
			return;
			function recurs(nextElements, column, row){
				for (var i=0; i< nextElements.length; i++){
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(row*50 + 13,column*50+ 25);
					ctx.lineTo((row+i)*50 +13 ,(column+1)*50);
					ctx.stroke();
				drawElement(ctx,nextElements[i], row + i, column+1);
				}
			}
			recurs(nextElements, column, row);
		 }
			
		
	
}