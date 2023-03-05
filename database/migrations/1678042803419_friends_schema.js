'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FriendsSchema extends Schema {
  up () {
    this.create('friends', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('friends')
  }
}

module.exports = FriendsSchema
