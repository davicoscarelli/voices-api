"use strict";
const Helpers = use("Helpers");
const base = Helpers.publicPath("user_storage");
const fs = require("fs");
const crypto = require("crypto");
const axios = require('axios');


class StorageUser {

  static getBase64 = async (url) => {
    console.log("ENTROUU", url)
    try {
        var result =  await axios
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response =>  new Buffer.from(response.data, 'binary').toString('base64'))


        return result
    }catch (e) {
      console.log("AAAA",e)
      return {error: e};
    }
}
  // save file
  static async saveVoice(user, file) {
    try {
      const path = await this._getVoicesPath(user);
      const filePath = Helpers.publicPath(`tmp/${file}`);
      await fs.renameSync(filePath, `${path}/${file}`);
      return `${user.folder}/voices/${file}`;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // delete file
  static async delete(user, file) {
    try {
      const path = await this._getVoicesPath(user);
      await fs.unlinkSync(`${path}/${file}`);
      return true;
    } catch (e) {
      return false;
    }
  }


  static async _getVoicesPath(user) {

    let path = `${base}/${user.folder}`;
    if (user.folder && (await fs.existsSync(path))){
      path = `${base}/${user.folder}/voices`;
      if(await fs.existsSync(path)){
        return `${path}`;
      }else{
        await fs.mkdirSync(path);
        return `${path}`;
      }
    } 
    // create folder
    const folder = crypto.createHash("md5").update(`${user.id}`).digest("hex");
    user.folder = folder;
    await user.save();
    path = `${base}/${user.folder}`;
    await fs.mkdirSync(path);
    let filesPath = `${base}/${user.folder}/voices`
    await fs.mkdirSync(filesPath);

    return filesPath;
  }
}

module.exports = StorageUser;
