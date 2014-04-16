/**
 * Lanza un evento ajax para obtener la informacion del usuario
 * Devuelve un array con la informacion basica del usuario y la muestra en
 * un modal
 * @returns {undefined}
 */
function showProfiles(){
   $(".show").off("click").on('click',function(event){
       event.preventDefault();
       $.get(
                $(this).attr('href'),
                function(data){
                    $('#username').html(data.username);
                    $('#native').html(data.native);
                    $('#foreign').html(data.foreign);
                    $('#description').html(data.description);
                    $('#myModal').foundation('reveal', 'open');
                },
                'json'
            );
   });
} 

