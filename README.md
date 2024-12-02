# GitHub Followers and Following Fetcher

Esta aplicación te permite obtener y mostrar información sobre tus seguidores, seguidos y usuarios que no te siguen en GitHub. Utiliza la API de GitHub para obtener los datos y mostrarlos en una tabla bonita y organizada.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/github-followers-fetcher.git
   ```

2. Navega hasta el directorio del proyecto:

   ```bash
   cd github-followers-fetcher
   ```

3. Abre el archivo `index.html` en tu navegador.

## Uso

1. Ingresa tu nombre de usuario de GitHub en el campo de texto.
2. Haz clic en el botón "Enviar".
3. La aplicación recuperará y mostrará tus seguidores, seguidos y aquellos que no te siguen en una tabla.

## Tokens de Autenticación

Para realizar más peticiones a la API de GitHub y evitar límites de tasa, puedes usar un token de autenticación personal. Con el token, puedes realizar hasta 5000 peticiones por hora en lugar de las 60 peticiones por hora sin autenticación.

Puedes generar un token de autenticación personal en la configuración de tu cuenta de GitHub, en la sección de "Developer settings" bajo "Personal access tokens". Asegúrate de mantener tu token seguro y no compartirlo públicamente.

## Estructura del Código

La aplicación está estructurada de la siguiente manera:

- **index.html**: Contiene la estructura HTML y los estilos básicos para la aplicación.
- **app.js**: Contiene el código JavaScript para realizar las peticiones a la API de GitHub y manipular el DOM para mostrar los resultados.

## Estilos

Los estilos de la aplicación están definidos en una etiqueta `<style>` dentro del archivo `index.html`. Puedes personalizarlos según tus preferencias.

## Contribuciones

¡Contribuciones son bienvenidas! Si encuentras un problema o tienes una mejora, no dudes en abrir un issue o enviar un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
