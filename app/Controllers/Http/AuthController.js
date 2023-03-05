"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Jwt')} Auth */
/** @typedef {import('adonis-bumblebee/src/Bumblebee')} Transformer */


/** @type {typeof import('../../../Models/User')} */
const User = use("App/Models/User");


class AuthController {
  /**
   * make auth login
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   * @param {Transformer} ctx.transform
   */
  async login({ request, response, auth }) {
    try {
      
        const { email, password } = request.all();
        const user = await User.query().where("email", email).first();
        console.log("ENTROU")
        const tokens = await auth.withRefreshToken().attempt(email, password);
        console.log("AAAAAA", tokens)
        

        return response.send({ tokens, user });

    } catch (error) {
      console.log("AAAAA", error);
      return response.status(400).send("InvalidCredentials");
    }
  }

  /**
   * make auth refresh
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   * @param {Transformer} ctx.transform
   */
  async refresh({ request, response, auth }) {
    try {
      const refreshToken =
        request.input("refresh_token") || request.header("refresh_token");

      /** refreshing token */
      const tokens = await auth
        .newRefreshToken()
        .generateForRefreshToken(refreshToken);

      /** getting uid from new token payload */
      const payload = tokens.token.split(".")[1];
      const buff = Buffer.from(payload, "base64");
      const { uid } = JSON.parse(buff.toString("utf-8"));

      /** getting user data */
      const user = await User.find(uid);


      return response.send({ tokens, user });
    } catch (error) {
      return response.status(400).send("InvalidToken");
    }
  }

  /**
   * make auth logout
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async logout({ request, response, auth }) {
    try {
      const refreshToken =
        request.input("refresh_token") || request.header("refresh_token");

      await auth.authenticator("jwt").revokeTokens([refreshToken], true);
      return response.status(204).send({});
    } catch (error) {
      return response.status(500).send("ServerError");
    }
  }
  async me({ response, auth }) {
    try {
      let loggedUser = await auth.getUser();
      
      const user = await User.query().where("id", loggedUser.id).first();
      return response.send(user);
    } catch (error) {
      console.log(error)
      return response.status(400).send("InvalidToken");
    }
  }
}

module.exports = AuthController;
