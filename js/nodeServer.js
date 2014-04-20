// inicia un socket cuya funcion es ser de servidor
var server = require('socket.io').listen(3000);
//var url = require('url');
//var query = require('querystring');
var mysql = require('mysql');

// almacena informacion sobre los usuarios
/**
 * users =>
 *  identificador del socket => username
 *  total => numero de usuarios online
 *  OOOOOOOOOOOOOOOO
 *  users =>
 *  identificador del socket => array(
 *      username=>el username,
 *      native_langauge => el idioma nativo)
 *  total => numero de usuarios online
 * @type user
 */
// Una lista a parte para tener la informacion de todos os usuarios
// Es la lista que se le pasa al cliente para generar la tabla
var users = {};

/**
 * Cuando un usuario envia una peticion, en rooms se genera un nuevo lugar{}
 * con la key del usuario que hizo la peticion. Dentro de ese objeto generado
 * Se almacenara el numero de la habitacion y dentro de ese numero estara el objeto
 * que almacene las keys del los usuarios que estan hablando
 * Cada usuario que este en una sala privada, se generara un objeto con su key
 * en rooms. De esta forma cada usuario sabe con que usuarios estaban en la sala
 * {identificador_usuario={
 *          'numero habitacion' = {keys}
 *      }
 * }
 * 
 * @type type
 */

// Almacena las salas privadas creadas, junto las keys de quien las ocupa y 
// el nombre
/**
 * rooms => {
 *  'key del usuario' : array(1,2,3,4(numero de las habitaciones))
 * }
 * @type Array|Array
 */
var rooms = {}

// Es el numero de habitaciones que hay
var roomNumber = 1;

// Es la relacion entre la key y leel socket
/**
 * relations => {
 * 
 *  key del usuario : socket en esa conexion
 * }
 * @type socket|socket
 */
var relations = {};

// las peticiones que hay pendientes para entrar en una  sala privada
/**
 * petitions => {
 * 
 *  'key del usuario' : array(1,2,3,4(numero de las habitaciones))
 * }
 * @type Array
 */
var petitions = {};

// Total de usuarios conectado
var total = 0;

// relaciona el numero de habitacion con el propietariod de la habitacion
/**
 * privateChats => {
 * 
 *  numero de la habitacion: array(key del que realzio la peticion,
 *                                  key del que acepta la peticion)
 * }
 * 
 * @type host|host|host|host
 */
var privateChats = {};

// Aqui se guardan las conversaciones de cada sala de chat privada
/**
 * speechs => {
 * 
 *  numero de la habitacion => {
 *  
 *      username => Array(conversacion,conversacion)
 *      username2 => Array(conversacion, conversacion)
 *  }
 * 
 * }
 * @type type
 */
var speechs = {}
//var clients = server.sockets.clients();
server.sockets.on('connection',function(socket){
    
    // obtengo la key que identifica al usuario
    var key = socket.handshake.query.key;
    //socket.emit('who');
    

   // Si el usuario no esta registrado(el identificador esta en users), entrara en el if
   // en caso contrario seria en el else
    if(!users.hasOwnProperty(key)){

        // configura la conexion con la base de datos y se conecta a
        // la base de datos language_chat
         var connection = mysql.createConnection({
             host     : 'localhost',
             user     : 'root',
             password : '',
             database : 'language_chat'
           });

         // Hago una query para obtener el username,native_language y foreign_language
         // Cuando se completa la conexion se ejecuta el callback
         connection.query(
                 'SELECT username,native_language,foreign_language FROM users WHERE key_chat=? LIMIT 1',
                 [key],
                 // en el callback, compruebo si ha habido algun error
                 // en caso de que lo haya, lo muestro
                 function(err, rows, fields){
                     if(err){
                         throw err
                     }
                     else{
                         // si ha obtenido los datos, genero el user temporal
                         // para meter la informacion necesaria en users
                         var user = {
                             username:rows[0]['username'],
                             native_language:rows[0]['native_language'],
                             foreign_language:rows[0]['foreign_language'],
                             connected:true,
                         }

                         // en le objeto users meto el la informacion del usuario
                         // obtenida anteriormente y el identificador para ese
                         // nombre sera la key_chat 
                         users[key] = user;

                         // aumento en +1 el total de usuarios conectados
                         if(total != 0){
                             total++;
                         }
                         else{
                             total = 1;
                         }

                         // lo almaceno en el objeto users
                         users['total'] = total;

                         // guardo la relacion de la key con el socket
                         relations[key] = socket;

                         // le digo a todos los usuarios conectados que 
                         // actualicen als tablas
                         server.sockets.emit('update',users);
                     }
                 }
             );
        // Cierro la conexion con la base de datos  
        connection.end()
     }
     else{
         //setTime(data['username']);
         // guardo la relacion de la key con el socket
         relations[key] = socket;
         socket.emit('update',users);
         users[key].connected = true;
         
         // compruebo si el usuario tiene peticiones pendientes,
         // en caso de ser asi, las recogera y asl enviara con la peticion
         // repeatPetition
         if(petitions.hasOwnProperty(key)){
             petitions[key].forEach(function(numberRoom){
                 var host = privateChats[numberRoom][0];
                 var user = users[host].username;
                 var data = {
                     user: user,
                     room: numberRoom
                 }
                 socket.emit('repeatPetition',data);
             })
         }
         
         // Compruebo si el usuario tiene alguna sala privada abierta
         // En ese caso, le pedire que la abra de nuevo
         if(rooms[key] != undefined){
             
             rooms[key].forEach(function(numberRoom){
                try{
                    var host = privateChats[numberRoom][0];
                    var data = {
                        host: users[host].username,
                        inv: users[key].username,
                        room: numberRoom,
                        speech: speechs[numberRoom]
                    }
                    // Le vuevo a meter en la sala
                    socket.join(numberRoom);
                    // se envia a si mismo los chats abiertos que tiene
                    // para poder generarlos de nuevo
                    socket.emit('createPrivate',data);
                }
                catch(err){
                    console.log('Error en la habitacion');
                }
             });
             
         }
     }
  
   // Se ejecuta cuando el usuario se desconecta
   socket.on('disconnect',function(){
        //console.log('DESCONECTADOOO');

        // obtengo el usuario que se ha conectado
        var user = socket.handshake.query.key;
        
        // pongo a false la conexon
        users[user].connected = false;
        // ejecuto al funcion setTime la cual si el atributo
        // connected sigue en false, eliminara ese usuario
        setTime(user);
   });
   
   socket.on('update',function(){
       socket.emit('update',users);
   });
   
   // Permite al que hace la peticion, genear la habitacion y enviar
   // la peticion al usuario
   socket.on('join',function(key){
       //console.log(key);
       // obtengo la key del usuario que ha enviado la peticion
       var host = socket.handshake.query.key;
 
            
            privateChats[roomNumber] = new Array();
            privateChats[roomNumber].push(host);


        // compruebo si ya la key del invitado esta en peticiones y guardo
        // la key
        if(!petitions.hasOwnProperty(key)){
       
            
       
            petitions[key] = new Array();
            
            petitions[key].push(roomNumber);
            
        }
        else{
            
            petitions[key].push(roomNumber);
              
        }
        // preparo la informacion que sera enviada al usuario
        // nombre de usuario y el numero de la habitacion
        var data={
            user: users[host]['username'],
            room: roomNumber
        };
        
        relations[key].emit('petition',data);
        
        // aumento en +1 el numero de la habitacion
        roomNumber++;
        
        //console.log(users[host]);
   });
  
  // Elimina una peticion de union a una sala privada
  // recibe el numero de la habitacion
  socket.on('reject',function(room){
      
      // eliminacion de la peticion
      var index = petitions[key].indexOf(room);
      
      petitions[key].splice(index,1);
      
      // eliminacion de del creador de la peticion
      // 0: El que realizo la peticion
      // 1: el que acepta la peticion
      var host = privateChats[room][0];
      
      delete privateChats[room];
      
      //console.log('PETICION DE HABITACION ELIMINADA');
      
      // Envio la informacion al usuario que inicio la peticion privada
      
      // el usuario es key porque es el que ha rechazado la invitacion el que emite el
      // reject, por eso, tiene que ser key
      var data = {
          user: users[key].username,
          room: room
      };
      
      // emito el reject al usuario host, que es el que creo la peticion
      
      relations[host].emit('reject',data);
  });
  
  // Permite aceptar las peticiones de habitaciones privadas
  // recibe el numero de la habitacion
  socket.on('accept',function(room){
      
      // Como la peticion ha sido aceptada, la elimino
      var index = petitions[key].indexOf(room);
      
      petitions[key].splice(index,1);
      
      // obtento la key del que realizo la peticion
      var host = privateChats[room][0];
      
        // Ahora en cada room[key] genero una nueva sala
        // para el anfitrion, es decir, el que realizo la peticion y es el host
        if(!rooms.hasOwnProperty(host)){

            rooms[host] = new Array();

            rooms[host].push(room);

            
        }
        else{

            rooms[host].push(room);

            
        }
        
        // para el que acepta la peticion
        if(!rooms.hasOwnProperty(key)){

            rooms[key] = new Array();

            rooms[key].push(room);
            
            privateChats[room].push(key);
            
        }
        else{

            rooms[key].push(room);
            
            privateChats[room].push(key);
        }
      
        // Genero la room en el socket y los meto en ella
        
        // el usuario que acepta la peticion
        // socket es el usuario que acepto la peticion
        socket.join(room);
        // el usuario que realiza la peticion(el propietario de la sala privada)
        relations[host].join(room);
      
        // El usuario que ha aceptado la peticion
        var user = users[key].username;
        
        // emito un comunicado al anfitrion, diciendole que se ha aceptado la solicitud
        relations[host].emit('accept',user);
        
        // Preparo los datos para ser enviados a los dos usuarios
        var data = {
            host: users[host].username,
            inv: users[key].username,
            room: room
        }
        
        // envio un mensaje a los dos usuarios que estan en la sala privada
        server.sockets.in(room).emit('createPrivate',data);
        
        // genero los arrays para cada usuario(host e invitado), donde
        // se guardaran las conversaciones
        speechs[room] = {};
        speechs[room][data['host']] = new Array();
        speechs[room][data['inv']] = new Array();
        
        //console.log('PETICION ACEPTADAAAAAAA');
  });
  
  // Cuando se reciba un mensaje, se enviara a todos los de esa habitacion
  socket.on('sendRoom',function(data){
      //console.log('RECIBIDO PARA LA HABITACION');
      
      if(data['message'] != ''){

            var message = {
                message: data['message'],
                user: users[key].username,
                room: data['room']
            };

            // Guardo la conversacion
            speechs[data['room']][message['user']].push(data['message']);
            // envio la informacion del mensaje
            server.sockets.in(data['room']).emit('message',message);
        }
  })
  
});

// prepara la informacion a enviar a los otros usuarios
// cuando un nuevo usuario se conecta
function getInfo(socket){
    var info = new Array();
    // usuarios totales conectados
    info.push(users['total']);
    // toda la informacion del usuario
    info.push(users[socket['id']]);
    // el id del socket del usuario
    info.push(socket['id']);
    // devuelve la informacion
    return info;
}


// Si al cabo de 5 segundos, el usuario no se ha vuelto a conectar, sera eliminado
function setTime(key){
    setTimeout(function(){
        //console.log('USUARIOOO: '+key);
        try{
            if(!users[key].connected){
                // elimino al usuario
                delete users[key];
                total--;
                // cambio el total de usuarios conectado
                users['total'] = total;
                //console.log(total);
                // envio un mensaje a todos de que actualicen las tablas
                server.sockets.emit('update',users);
                // elimino las habitaciones en las que estaba el usuario
                rooms[key].forEach(function(room){
                    server.sockets.in(room).emit('message','Un chat privado se ha eliminado');
                    delete privateChats[room];
                })
            }
        }
        catch(err){
            //console.log('El usuario no existe');
        }
    },5000);
}

function findUser(){
    
}