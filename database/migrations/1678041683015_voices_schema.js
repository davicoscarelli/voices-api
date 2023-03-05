'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VoicesSchema extends Schema {
  up () {
    this.create('voices', (table) => {
      table.increments()
      table.text("topic")
      table.text("response")
      table.text("response_url")
      table.text("podcast_id")
      table.timestamps()
    })
  }

  down () {
    this.drop('voices')
  }
}

module.exports = VoicesSchema
