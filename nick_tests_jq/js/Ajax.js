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
   url: "page.php",
   processData: false,
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

