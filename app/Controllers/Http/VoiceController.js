'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const StorageUser = use("App/Services/StorageUser");
const Voice = use("App/Models/Voice");
const Database = use("Database");
const Helpers = use("Helpers");
const fs = require("fs");
const Env = use("Env");


/**
 * Resourceful controller for interacting with voices
 */
class VoiceController {
  /**
   * Show a list of all voices.
   * GET voices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new voice.
   * GET voices/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new voice.
   * POST voices
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {

    const audio_file = request.only("audio");

    const voice = request.only(Voice.fillable);
    
    const loggedUser = await auth.getUser()

    try {
      if (audio_file) {
        const audio = audio_file.audio
        const path = Helpers.publicPath("tmp");
        const fileName = new Date().getTime() + ".wav";
        let base64Audio = audio.split(";base64,").pop();
        const fileSave = `${path}/${fileName}`;
        await fs.writeFileSync(fileSave, base64Audio, { encoding: "base64" });
        const newPath = await StorageUser.saveVoice(loggedUser, fileName);
        const baseUrl = Env.get("APP_URL");
        let response_url =  `${baseUrl}/user_storage/${newPath}`;
        voice.response_url = response_url;
      }

      const trx = await Database.beginTransaction();
      
      await Voice.create(voice, trx);
      await trx.commit();

      return response.status(201).send(voice);
    } catch (e) {
      console.log(e);
      trx.rollback();
      return response.status(400).send("NotCreated");
    }
  }

  /**
   * Display a single voice.
   * GET voices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response }) {
    const voice = await Voice.findOrFail(id);
    return response.send(voice);
  }

  /**
   * Render a form to update an existing voice.
   * GET voices/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update voice details.
   * PUT or PATCH voices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a voice with id.
   * DELETE voices/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = VoiceController
