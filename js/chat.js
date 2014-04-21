// ES GLOBAL PARA PODER USARLA EN OTRAS FUNCIONES FUERA DEL READY
var client;
$( document ).ready(function() {
    
    // obtengo la ip del usuario y la guardo en la cookie ip
    var error;
    var login = false;
    try{
        // CAMBIAR EL NOMBRE DE USUARIO POR ID
        client = io.connect('http://192.168.1.33:3000?key='+$.cookie('key'));
        
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
        
        // Se ejecutara cuando reciba una peticion para un chat privado
        // mostrara un mensaje al usuario, en invitaciones se cambiara
        // el numero de invitaciones y se mostraraal usuario
        client.on('petition',function(data){
            
            message($('#js-alert'),'Has recivido una invitacion del usuario: ' + data.user,'info');
            var inv = parseInt($('#ninv').html());
            inv = inv + 1;
            $('#ninv').html(inv);
            
            // El id es a-Numero habitacion(para el boton aceptar)
            // El id es r-Numero habitacion(para el boton rechazar)
            
            var li = $('#list-invtations').append('<li id=room-'+data.room+'>'+data.user+': <button class="tiny" id=a-'+data.room+'>Aceptar</button> <button class="tiny" id=r-'+data.room+'>Rechazar</button></li>');
            
            // añado el evento click al boton aceptar
            $('#a-'+data.room).on('click',function(event){
                //alert('SOY UN ACPETAR');
                client.emit('accept',data.room);
                
                // elimino el elemento con los botones y la lista
                $('#room-'+data.room).remove();
                
                // cambio el numero de invitaciones
                var inv = parseInt($('#ninv').html());
                inv = inv - 1;
                $('#ninv').html(inv);
            })
            
            $('#r-'+data.room).on('click',function(event){
                
                //alert('SOY UN RECHAZAR');
                // envio un mensaje apra que se entere el usuario rechazado
                client.emit('reject',data.room);
                
                // elimino el elemento con los botones y la lista
                $('#room-'+data.room).remove();
                
                // cambio el numero de invitaciones
                var inv = parseInt($('#ninv').html());
                inv = inv - 1;
                $('#ninv').html(inv);
            })
            //li.html('pruebaaaa');
        })
        
        client.on('repeatPetition',function(data){
            
            //message($('#js-alert'),'Has recivido una invitacion del usuario: ' + data.user,'info');
            var inv = parseInt($('#ninv').html());
            inv = inv + 1;
            $('#ninv').html(inv);
            
            var li = $('#list-invtations').append('<li id=room-'+data.room+'>'+data.user+': <button class="tiny" id=a-'+data.room+'>Aceptar</button> <button class="tiny" id=r-'+data.room+'>Rechazar</button></li>');
            
            $('#a-'+data.room).on('click',function(event){
                client.emit('accept',data.room);
                
                // elimino el elemento con los botones y la lista
                $('#room-'+data.room).remove();
                
                // cambio el numero de invitaciones
                var inv = parseInt($('#ninv').html());
                inv = inv - 1;
                $('#ninv').html(inv);
            })
            
            $('#r-'+data.room).on('click',function(event){
                
                // envio un mensaje apra que se entere el usuario rechazado
                client.emit('reject',data.room);
                // elimino el elemento con los botones y la lista
                $('#room-'+data.room).remove();
                
                // cambio el numero de invitaciones
                var inv = parseInt($('#ninv').html());
                inv = inv - 1;
                $('#ninv').html(inv);
            })
            //li.html('pruebaaaa');
        })
        
        // muestra un mensaje cuando una peticion es rechazada
        client.on('reject',function(data){
            message($('#js-alert'),'El usuario: '+data.user+' ha rechazado tu invitacion','info');
            //$('#room-'+data.room).remove();
        });
        
        // muestra un mensaje cuando una peticion es aceptada
        client.on('accept',function(user){
            message($('#js-alert'),'El usuario: '+user+' ha aceptado tu invitacion','info');
            //$('#room-'+data.room).remove();
        });
        
        // Crea la sala privada y prepara los botones y todo lo necesario
        client.on('createPrivate',function(data){
            //alert('ENVIADO A LOS DOS');
            
            $.post('http://localhost/languageChat/index.php?r=site/CreateChatRoom',
                   data,function(html){
                       // en privated-chats meto el html recibido del renderPartial
                       $('#privated-chats').append(html);
                       // añado un evento de click al boton, para que envie el mensage
                       $('#b-'+data['room']).on('click',function(event){
                           var sendData = {
                               message: $('#t-'+data['room']).val(),
                               room: data['room']
                           }
                           client.emit('sendRoom',sendData);
                       });
                       // Si el chat, tiene textos ya escritos, entonces los
                       // muestro al usuario que ha pedido los texto
                       if(data['speech'] != undefined){
                           data['speech'].forEach(function(message){
                               //alert(message['user']);
                                $('#c-'+data['room']).append(
                                        '<li id="text-chat"><strong>'+
                                        message['user']+
                                        ': </strong>'+
                                        message['text']+
                                        '<span class="right" id="list-options"><a href="#">save text</a></span></li>'
                                        );
                           });
                       }
                   },
                   'html');
            
        });
        
        // Escribe el mensaje que ha recibido en el chat privado
        client.on('message',function(data){
            //alert('recibido');
            $('#c-'+data['room']).append('<li><strong>'+data['user']+': </strong>'+data['message']+'</li>');
            $('#t-'+data['room']).val('');
        })
        
        client.on('info',function(message){
             message($('#js-alert'),message,'info');
        })
    }
    
    function createChatRoom(){
        
    }
    
    /*function sendPetition(key){
        client.emit('petition',key);
    }*/
    
});

// ESTA FUNCION ESTA FUERA PORQUE SE TIENE QUE INICIALIZAR AL PRINCIPIO
/**
    * Lanza un evento ajax para obtener la informacion del usuario
    * Devuelve un array con la informacion basica del usuario y la muestra en
    * un modal. Despues pone el evento click al boton con el id sendPetition
    * el cual si se pulsa, ejecutara una peticion(petition) al servidor, para
    * crear una sala privada con el usuario
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
                    $('#sendJoin').off('click').on('click',function(event){
                        //event.preventDefault();
                        client.emit('join',data.key);
                        $('#myModal').foundation('reveal', 'close');
                        message($('#js-alert'),'La peticion ha sido realizada','info');
                        
                    });
                },
                'json'
            );
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

