$( document ).ready(function() {
    // obtengo la ip del usuario y la guardo en la cookie ip
    var error;
    var login = false;
    try{
        // CAMBIAR EL NOMBRE DE USUARIO POR ID
        var client = io.connect('http://192.168.1.33:3000?key='+$.cookie('key'));
        
    }
    catch(err){
        message($('#js-alert'),'El chat no esta disponible porque hay un error de conexion','warning');
       
        
    }
    
    
    if(client != null){
        // Actualizo la tabla con la nueva informacion
        client.on('update',function(users){
            try{
                $.fn.yiiGridView.update('list-users',{data: users, type: 'POST'});
                console.log('HA ENTRADOOOO');
            }
            catch(err){
                
            }
            $('#total').html(users.total); 
        });

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
    }
});


