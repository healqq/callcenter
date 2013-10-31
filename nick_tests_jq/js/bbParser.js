//Аналог бб-кодов с ограниченным функционалом.
//TODO: цвет.
var bbCodeParserSingleton = (function(){
    function bbCodeParserSingleton() {
	//private
	
	
	//public
	return{
		//adding info about div block
		bbToHTML: function(str){
			var bbTokens = ['\\[b\\]?(.*?)\\[/b\\]','\\[u\\]?(.*?)\\[/u\\]','\\[i\\]?(.*?)\\[/i\\]','\\[color\=?(.*?)](.*?)\\[/color]','\n'];
			var htmlTokens =['<b>$1</b>','<u>$1</u>','<i>$1</i>','<font color="$1">$2</font>','<br>'];
			for( var i = 0; i < bbTokens.length; i++ ){
				//alert(bbTokens[i]);
				//alert(htmlTokens[i]);
				//alert(str);
				//alert(str.search(new RegExp(bbTokens[i],'g') ) );
				str = str.replace(new RegExp(bbTokens[i], 'g'), htmlTokens[i]);
				
			}
			//$('#test').empty();
			//$('#test').append(str);
			return str;
			
			
			
		},
		htmlToBB: function(str){
			var htmlTokens =['<br>','<b>?(.*?)</b>','<u>?(.*?)</u>','<i>?(.*?)</i>','<font color=\"?(.*?)\">?(.*?)</font>'];
			var bbTokens = ['\n','[b]$1[/b]','[u]$1[/u]','[i]$1[/i]','[color=$1]$2[/color]'];
			for( var i = 0; i < bbTokens.length; i++ ){
				//alert(bbTokens[i]);
				//alert(htmlTokens[i]);
				//alert(str);
				//alert(str.search(new RegExp(bbTokens[i],'g') ) );
				
				str = str.replace(new RegExp(htmlTokens[i], 'g'), bbTokens[i]);
				
			}
			return str;
		},
		addTag: function(element, tagName){
			var stringToAdd = '';
			switch (tagName){
			case "b": stringToAdd ='[b][/b]';break;
			case "i": stringToAdd ='[i][/i]';break;
			case "u": stringToAdd ='[u][/u]';break;
			case "br": stringToAdd = '[br]';break;
			case "color":stringToAdd = '[color][/color]';break;
			default:
			}
			var start = element[0].selectionStart;
			var end = element[0].selectionEnd;
			var textAreaValue = element.val();
			if (start === end){
				element.val(textAreaValue.substring(0, start)+stringToAdd+textAreaValue.substring(end) );
			}
			else{
				var addStringSeparator = stringToAdd.search(']');
				element.val(textAreaValue.substring(0, start) + stringToAdd.substring(0, addStringSeparator+1) +
				textAreaValue.substring(start, end) +
				stringToAdd.substring(addStringSeparator+1) + textAreaValue.substring(end) );
				
			}
		}
		
			
			
		
	
		
	}
}
    var instance;
    return {
		//get instance
        getInstance: function(){
            if (instance == null) {
                instance = new bbCodeParserSingleton();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
				//instance.init();
            }
            return instance;
        }
	};
})();