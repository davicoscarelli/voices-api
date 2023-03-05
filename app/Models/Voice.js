'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Voice extends Model {
    user () {
        return this.belongsTo('App/Models/User')
      }

    static get fillable() {
        return [
            "topic", 
            "response",
            "response_url",
            "podcast_id",
        ];
    }
}

module.exports = Voice
