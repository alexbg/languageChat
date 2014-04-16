$( document ).ready(function() {
    // obtengo la ip del usuario y la guardo en la cookie ip
    var error;
    var login = false;
    try{
        // CAMBIAR EL NOMBRE DE USUARIO POR ID
        var client = io.connect('http://192.168.1.33:3000?key='+$.cookie('key'));
        //error = false;
    }
    catch(err){
        message($('#js-alert'),'El chat no esta disponible porque hay un error de conexion','warning');
        //error = true;
        
    }
    //var user = setInfoUser();
    
    if(client != null){
    
       // si existe la cookie start, significa que se acaba de loguear
       // por eso envio el mensaje de login y cambioa la cookie a false
       /*console.log($.cookie('start'));
        if($.cookie('start') == true){
            //alert('loginnn');
            client.emit('login');
            $.cookie('start',false,{ path: '/' });
        }*/
        
        
        client.on('who',function(){
            var user = setInfoUser();
            //alert('whooo')
            client.emit('dni',user);
            
        }); 
        
        
        // Actualizo la tabla con la nueva informacion
        client.on('update',function(users){
            //console.log(users);
            try{
                $.fn.yiiGridView.update('list-users',{data: users, type: 'POST'});
                console.log('HA ENTRADOOOO');
            }
            catch(err){
                 /*$.post('index.php?r=site/getGrid',users,function(data){
                    // muestro la tabla de los usuarios
                    $('#users').html(data);
                    //$('.summary').remove();
                    });*/
                //$.fn.yiiGridView.update('list-users');
                //message($('#js-alert'),'Ha habido un error al buscar los usuarios conectados','info');
            }
            $('#total').html(users.total);
            
            //$.fn.yiiGridView.update('list-users');
            
            //alert('updateee');
        });
        
        /*client.on('delete',function(){
            console.log('eliminando');
            //$.fn.yiiGridView.update('list-users');
            var total = $('#total').html();
            total--;
            $('#total').html(total);
            //alert('updateee');
        });*/
        
        
        
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
    
    // preparo el objeto del usuario
    function setInfoUser(){
        var user = {};
        user['username'] = $.cookie('username');
        user['native'] = $.cookie('native');
        user['foreign'] = $.cookie('foreign');
        user['key'] = $.cookie('key');
        return user;
    }
                    
    /*function error(){
        if(error){
            message($('#js-alert'),'El chat no esta disponible','info'); 
        }
    }
    
    function login(){
        login = true;
    }*/
     
});


