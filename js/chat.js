$( document ).ready(function() {
    // obtengo la ip del usuario y la guardo en la cookie ip
    
    try{
        var client = io.connect('http://192.168.1.33:3000');
    }
    catch(err){
        message($('#js-alert'),'Hay un error en la conexion','warning');
        
    }
    var user = setInfoUser();
    
    if(client != null){
    
        // evento que se ejecutara cuando el servidor, le pida saber quien es
        client.on('who',function(){
           
           client.emit('user',user);
           
        });

        // muestra el mensaje de bienvenida
        client.on('welcome',function(text){
            message($('#js-alert'),text,'success');
        });
        
        // obtiene la informacion de todos los usuarios
        client.on('users',function(users){
            
            // Hago una peticion post para obtener la tabla
            $.post('index.php?r=site/getGrid',users,function(data){
                // muestro la tabla de los usuarios
                $('#users').html(data);
                $('.summary').remove();
            });
            
            $('#total').html(users['total']);
        });
        
        // actualiza la informacion del cliente, este evento se ejecutara cuando
        // algun usuario se desconecte o entre uno nuevo
        client.on('update',function(info){
            // cambia el numero de usuarios online
            $('#total').html(info[0]);
            // genera una nueva columna
            // recuerda que cada columna tiene como class el id del socket
            var column = $('.items').append(
                            '<tr class='+info[2]+'>'+
                            '<td>'+info[1]['username']+'</td>'+
                            '<td>'+info[1]['native']+'</td>'+
                            '<td>'+info[1]['foreign']+'</td>'+
                            '</tr>'
                            );
            
        })
        
        // Elimina de la tabla el usuario desconectado
        client.on('delete',function(info){
            // cambia el numero de usuarios onlie
            $('#total').html(info[0]);
            // elimina mediante el id del socket la columna
            $('.'+info[2]).remove();
            console.log($('.'+info[2]));
        });
        
        /// muestra un error si por algun motivo se pierde la conexion
        client.on('error',function(){
            message($('#js-alert'),'Se ha desconectado','info');
            $('#total').html(0);
            $('.items').html('');
        });
    }
    
    /**
     * @param {html} element: el elemento al que le quieras poner el mensaje
     * @param {string} message: el mensaje que quieras poner
     * @param {string} type: el tipo de mensaje
     * @returns {undefined}
     **/
    function message(element,message,type){
        element.html(message).hide();
        switch(type){
            case 'dange':
                element.attr('class','alert alert-danger ajax affix');
                break;
            case 'success':
                element.attr('class','alert-box success text-center');
                break;
            case 'warning':
                element.attr('class','alert-box warning text-center');
                break;
            case 'info':
                element.attr('class','alert-box info text-center');
                break;
        };
        element.show(500).delay(3000).hide(500);
    };
    
    // preparo el objeto del usuario
    function setInfoUser(){
        var user = {};
        user['username'] = $.cookie('username');
        user['native'] = $.cookie('native');
        user['foreign'] = $.cookie('foreign');
        return user;
    }
    
});


