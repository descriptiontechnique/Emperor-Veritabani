const chalk = require('chalk');  //kanka bi gezisin var yilan gibi amk jwkqlql
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
var prefix = ayarlar.prefix;

module.exports = client => {
 setInterval(function() {
}, 8000);
client.user.setPresence({
        game: {
            name: `Emperor Of Developed!`,
            type: 'WATCHING'  
        },
        status: 'online'
    })
    console.log(`Veritabanı Botu Aktif.`);
}
