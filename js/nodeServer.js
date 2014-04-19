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
 * hostNumber => {
 * 
 *  numero de la habitacion: key del que hizo la peticion para un chat privado
 * }
 * 
 * @type host|host|host|host
 */
var hostNumber = {};
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
                 var host = hostNumber[numberRoom];
                 var user = users[host].username;
                 var data = {
                     user: user,
                     room: numberRoom
                 }
                 socket.emit('repeatPetition',data);
             })
         }
         //console.log(users[data['key']]);
     }
  
   // Se ejecuta cuando el usuario se desconecta
   socket.on('disconnect',function(){
        console.log('DESCONECTADOOO');

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
       
       // compruebo si rooms ya tiene la key del host(del que hace la peticion)
       // en caso de no tenerla, genera el array y inserta el numero de habitacion en el array
       if(!rooms.hasOwnProperty(host)){
           
            //rooms[host] = new Array();
            
            //rooms[host].push(roomNumber);
            
            hostNumber[roomNumber] = host;
        }
        else{
            
            //rooms[host].push(roomNumber);
            
            hostNumber[roomNumber] = host;
        }
        
        // compruebo si ya la key del invitado esta en peticiones y guardo
        // la key
        if(!petitions.hasOwnProperty(key)){
       
            hostNumber[roomNumber] = host;
       
            petitions[key] = new Array();
            
            petitions[key].push(roomNumber);
            
        }
        else{
            
            hostNumber[roomNumber] = host;
            
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
        
        console.log(users[host]);
   });
  
  // Elimina una peticion de union a una sala privada
  socket.on('reject',function(room){
      
      // eliminacion de la peticion
      var index = petitions[key].indexOf(room);
      
      petitions[key].splice(index,1);
      
      // eliminacion de del creador de la peticion
      var host = hostNumber[room];
      
      delete hostNumber[room];
      
      console.log('PETICION DE HABITACION ELIMINADA');
      
      // Envio la informacion al usuario que inicio la peticion privada
      
      // el usuario es key porque es el que ha rechazado la invitacion el que emite el
      // reject, por eso, tiene que ser key
      var data = {
          user: users[key].username,
          room: room
      };
      
      relations[host].emit('reject',data);
  });
  
  // Permite aceptar las peticiones de habitaciones privadas
  socket.on('accept',function(room){
      
      // Como la peticion ha sido aceptada, la elimino
      var index = petitions[key].indexOf(room);
      
      petitions[key].splice(index,1);
      
      // obtento la key del que realizo la peticion
      var host = hostNumber[room];
      
        // Ahora en cada room[key] genero una nueva sala
        // para el anfitrion, es decir, el que realizo la peticion y es el host
        if(!rooms.hasOwnProperty(host)){

            rooms[host] = new Array();

            rooms[host].push(roomNumber);

            
        }
        else{

            rooms[host].push(roomNumber);

            
        }
        
        // para el que acepta la peticion
        if(!rooms.hasOwnProperty(key)){

            rooms[key] = new Array();

            rooms[key].push(roomNumber);

            
        }
        else{

            rooms[key].push(roomNumber);
  
        }
      
        // Genero la room en el socket y los meto en ella
        
        // el usuario que acepta la peticion
        socket.join(room);
        // el usuario que realiza la peticion(el propietario de la sala privada)
        relations[host].join(room);
      
        // El usuario que ha aceptado la peticion
        var user = users[key].username;
        
        // emito un comunicado al anfitrion, diciendole que se ha aceptado la solicitud
        relations[host].emit('accept',user);
        
        // Preparo los datos para ser enviados los dos usuarios
        var data = {
            host: users[host].username,
            inv: users[key].username,
            room: room
        }
        
        // envio un mensaje a los dos usuarios que estan en la sala privada
        server.sockets.in(room).emit('createPrivate',data);
        
      
        console.log('PETICION ACEPTADAAAAAAA');
  });
  
  // Cuando se reciba un mensaje, se enviara a todos los de esa habitacion
  socket.on('sendRoom',function(data){
      console.log('RECIBIDO PARA LA HABITACION');
      
      if(data['message'] != ''){

            var message = {
                message: data['message'],
                user: users[key].username,
                room: data['room']
            }

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
        console.log('USUARIOOO: '+key);
        try{
            if(!users[key].connected){
                delete users[key];
                total--;
                users['total'] = total;
                console.log(total);
                server.sockets.emit('update',users);
            }
        }
        catch(err){
            console.log('El usuario no existe');
        }
    },5000);
}

function findUser(){
    
}