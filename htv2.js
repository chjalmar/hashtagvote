var Twit = require('twitter');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/hashtagvoto';

var credentials = require("./creds.js");
//agregue las credenciales de su cuenta Twitter

var credenciales = credentials.creds('twitter');

console.log(credenciales);

var T = new Twit(credenciales);

//Con la librería 'twitter' el método stream no recibe un array para track en el 2do parámetro,
//sino un string, con palabras o hashtags o usuarios separados por comas, la como es como un "OR"
T.stream('statuses/filter', { track: '#FelizJueves,#siguemeytesigo' }, function(stream){

  stream.on('data', function (tweet) {
    //En esta función quiero:
    //Cuando aparezca un nuevo tweet (que use los hashtags del concurso):
    //- Guardarlo en la Base de Datos
    //- Escribir en un archivo de texto un objeto con:
    //  - La cuenta total que participaciones o tweets válidos que llevamos (traerla de la Base de datos)
    //  - Los datos del último Tweet: usuario, texto del tweet, timestamp
    
    console.log(tweet.user.screen_name);
    console.log(tweet.text);
    console.log(tweet.entities.hashtags);  
    console.log("\n");
    
    //arreglo "opciones", de opciones a votar en el concurso
    //OJO: Escribir en el arreglo el hashtag sin acentos y sin el numeral (#); las mayúsculas no importan
    var opciones = ["siguemeytesigo","MichelOnfray"];
    var hashtags = tweet.entities.hashtags;
    var contenido;
    
    //recorrer las opciones para ver por cuál votó el tweet
    for (var i = 0; i < opciones.length; i++) {
    	//recorrer los hashtags del tweet para compararlos con las opciones
      var contvotos = 0;
      for (var hashtag in hashtags) {
      	//eliminar acentos si el usuario los introdujo en el hashtag
      	var opcion = hashtags[hashtag].text;
      	opcion = opcion.replace(/á/ig,"a");
        opcion = opcion.replace(/é/ig,"e");
        opcion = opcion.replace(/í/ig,"i");
        opcion = opcion.replace(/ó/ig,"o");
        opcion = opcion.replace(/Ú/ig,"u");
        //poner todo en minúscula y comparar cada hashtag del tweet con nuestras opciones participantes
        //console.log(opcion.toLowerCase() + "||||" + opciones[i].toLowerCase());
        if (contvotos === 0) {
          //seguir chequeando sólo si no ha votado por alguna de las opciones en el mismo tweet
          if (opcion.toLowerCase() === opciones[i].toLowerCase()) {
             contenido = {
                          
                                    id: tweet.id,
                            created_at: tweet.created_at, 
    	                     screen_name: tweet.user.screen_name, 
    	                            text: tweet.text,
    	                            voto: opciones[i]
    	                             
                         };     	
             //Escribir al archivo
             printfile(contenido); 
          	 console.log("Ultimo tweet agregado al archivo, por @"+ tweet.user.screen_name +".");
          	 
          	 //Escribir a MongoDB
          	 
          	 MongoClient.connect(url, function(err, db) {
             assert.equal(null, err);
             insertInMongoDB(contenido, db, function() {
                 db.close();
             });
});
          	 
          	 i = opciones.length - 1;
          	 
          	 
          	 
          	 contvotos++;
          }
        }
      }  
    }
        
  });
  stream.on('error', function(error) {
    throw error;
  });
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

function insertInMongoDB (latest, db, callback) {
   db.collection('hashtagvoto').insertOne( {
      "tweets" : latest
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Documento insertado en la colección 'Tweets'.");
    callback();
  });
};
