#Sinopsis
App en Node para escuchar streams de Twitter buscando ciertos hashtags, y escribiendo los resultados en JSON

#Observaciones

La propiedad 'language', que se puede pasar al m�todo stream (aqu� se est� haciendo), tiene un problema: el idioma ('data.lang') es auto-detectado por Twitter, y cuando un tweet est� muy mal escrito, o todas las palabras son hashtags, Twitter es incapaz de detectar el idioma, devolviendo el valor 'und' (undefined) para la propiedad 'lang'. Entonces, ese tweet no ser� incluido en el stream

#Cambios

Agregado htv2.js, que utiliza la librer�a 'twitter' en lugar de 'twit'. Cambios en esa versi�n:

- La librer�a 'twitter' recibe la credencial de 'access_token' como 'access_token_key'.
- Usando la librer�a 'twitter', la propiedad 'track' del objeto que se pasa como segundo par�metro al m�todo 'stream' s�lo recibe un string con palabras, etiquetas o nombres de usuario separados por comas (la coma es como un operador l�gico "OR": ver documentaci�n de la API de Twitter en https://dev.twitter.com/streaming/overview/request-parameters#track ); mientras que la librer�a 'twit' puede recibir un arreglo, y convertir� los elementos del arreglo en una lista de elementos separados por comas.
- En la librer�a 'twitter', el stream recibido pasar� como par�metro a la funci�n callback que va como tercer par�metro del m�todo 'stream'. Dentro del callback, se puede llamar el m�todo 'on' para manejo de errores, entre otras opciones.