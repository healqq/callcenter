 // Загружает некоторые данные на сервер и оповещает пользователя по окончанию операции.
 
 $.ajax({
   type: "POST",
   url: "some.php",
   data: "name=John&location=Boston",
   success: function(msg){
     alert( "Data Saved: " + msg );
   }
 });
 
 
 // Отсылает документ XML в качестве данных на сервер. Автоматическое преобразование данных запрещено путем установки опции processData в false.

 var xmlDocument = [create xml document];
 $.ajax({
   type: "GET",
   url: "page.php",
   processData: true,
   data: xmlDocument,
   success: handleResponse
 });

    Код

// Посылает идентификатор в качестве данных на сервер, сохраняет данные и оповещает пользователя по окончанию операции.

 bodyContent = $.ajax({
      url: "script.php",
      global: false,
      type: "POST",
      data: ({id : this.getAttribute('id')}),
      dataType: "html",
      success: function(msg){
         alert(msg);
      }
   }
).responseText;


// function getStr(form)
// {
	// var tmp = [], el;
	// for(i=0; el = form.elements[i]; i++)
		// if( el.type == "hidden" && el.value != "" ) tmp.push(el.name + '=' + el.value);
	
// }




       function OtpravkaXML() {
            $("#btnCallWebService").click(function (event) {
                var wsUrl = "http://www.cbr.ru/dailyinfowebserv/dailyinfo.asmx?WSDL";
                var soapRequest ='<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">   <soap:Body> <getQuote xmlns:impl="http://abc.com/services/soap/server1.php">  <symbol>' + $("#txtName").val() + '</symbol>   </getQuote> </soap:Body></soap:Envelope>';
                               alert(soapRequest)
                $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest,
                    success: processSuccess,
                    error: processError
                });

            });
        });

        function processSuccess(data, status, req) { alert('success');
            if (status == "success")
                $("#response").text($(req.responseXML).find("Result").text());

                alert(req.responseXML);
        }

        function processError(data, status, req) {
        alert('err'+data.state);
            //alert(req.responseText + " " + status);
        } 

