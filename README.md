#Sinopsis
App en Node para escuchar streams de Twitter buscando ciertos hashtags, y escribiendo los resultados en JSON

#Observaciones

La propiedad 'language', que se puede pasar al método stream (aquí se está haciendo), tiene un problema: el idioma ('data.lang') es auto-detectado por Twitter, y cuando un tweet está muy mal escrito, o todas las palabras son hashtags, Twitter es incapaz de detectar el idioma, devolviendo el valor 'und' (undefined) para la propiedad 'lang'. Entonces, ese tweet no será incluido en el stream

#Cambios

Agregado htv2.js, que utiliza la librería 'twitter' en lugar de 'twit'. Cambios en esa versión:

- La librería 'twitter' recibe la credencial de 'access_token' como 'access_token_key'.
- Usando la librería 'twitter', la propiedad 'track' del objeto que se pasa como segundo parámetro al método 'stream' sólo recibe un string con palabras, etiquetas o nombres de usuario separados por comas (la coma es como un operador lógico "OR": ver documentación de la API de Twitter en https://dev.twitter.com/streaming/overview/request-parameters#track ); mientras que la librería 'twit' puede recibir un arreglo, y convertirá los elementos del arreglo en una lista de elementos separados por comas.
- En la librería 'twitter', el stream recibido pasará como parámetro a la función callback que va como tercer parámetro del método 'stream'. Dentro del callback, se puede llamar el método 'on' para manejo de errores, entre otras opciones.