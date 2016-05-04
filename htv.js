var Twit = require('twit');
var fs = require('fs');

//agregue las credenciales de su cuenta Twitter

var T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
  
});

var stream = T.stream('statuses/filter', { track: ['#felizmiercoles', '#siguemeytesigo'], language: 'es' })

stream.on('tweet', function (tweet) {
  //En esta función quiero:
  //Cuando aparezca un nuevo tweet (que use los hashtags del concurso):
  //- Guardarlo en la Base de Datos
  //- Escribir en un archivo de texto un objeto con:
  //  - La cuenta total que participaciones o tweets válidos que llevamos (traerla de la Base de datos)
  //  - Los datos del último Tweet: usuario, texto del tweet, timestamp
    
  
  //arreglo opciones, de opciones a votar en el concurso
  var opciones = ["siguemeytesigo","miercolesdeganarseguidores","saludos"];
  var hashtags = tweet.entities.hashtags;
  var contenido;
  
  //recorrer las opciones para ver por cuál votó el tweet
  for (var i = 0; i < opciones.length; i++) {
  	//recorrer los hashtags del tweet para compararlos con las opciones
    for (var hashtag in hashtags) {
      if (hashtags[hashtag].text.toLowerCase() === opciones[i].toLowerCase()) {
        contenido = {
                      totalcount: 123,
                      latest: {  created_at: tweet.created_at, 
  	                            screen_name: tweet.user.screen_name, 
  	                                   text: tweet.text
  	                          }
                    };     	
        //Escribir al archivo
        printfile(contenido); 
      	console.log("Ultimo tweet agregado al archivo, por @"+ tweet.user.screen_name +".");
      	i = opciones.length - 1;
      }
    }  
  }
  
    
});

function printfile(contenido){
    //fs.writeFile("latest.json", JSON.stringify(contenido,null,4), function(err) {
    //ahora mismo estoy acumulando los tweets que cumplen los criterios en vez de guardar sólo el último
    fs.writeFile("latest.json", JSON.stringify(contenido,null,4) + "\n",{ flag:"a" }, function(err) {
      if(err) {
          return console.log(err);
      }
    });
    
}