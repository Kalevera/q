# This is a mini MEAN stack login
This is meant to show one way to add webtokens to the request using routes.
This is a basic HTTP server with https cpabilities if uncommented. Certificates were self signed and generated for this tutorial

# Purpose of this repository is to show a basic server with middleware implementations.
If you review the app.js file you'll see multiple routes that you can move around to see how the middleware in auth_api affects the requests.

The goal is to use a JSON webtoken to manage route availability if the user isn't logged in or the token has expired the route will require the user to login again. You can see this more predominently when you adjust the exipration times.
