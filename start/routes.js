'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.post("login", "AuthController.login").as("auth.login");
    Route.post("refresh", "AuthController.refresh").as("auth.refresh");
    Route.post("logout", "AuthController.logout").as("auth.logout");
    Route.post("me", "AuthController.me").as("auth.me");

}).prefix("v1/auth")

Route.group(() => {
    Route.put("users/:id", "UserController.update").as("users.update");
    Route.post("users", "UserController.store").as("users.store");
    Route.get("users", "UserController.index").as("users.index");
    Route.get("users/:id", "UserController.show").as("users.show");

}).prefix("v1")

Route.group(() => {
    Route.put("voices/:id", "VoiceController.update").as("voices.update");
    Route.post("voices", "VoiceController.store").as("voices.store");
    Route.get("voices", "VoiceController.index").as("voices.index");
    Route.get("voices/:id", "VoiceController.show").as("voices.show");
    Route.get("topic", "VoiceController.topic").as("voices.topic");

}).prefix("v1")
