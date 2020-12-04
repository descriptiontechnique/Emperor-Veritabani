
const express = require('express');
const app = express();
const http = require('http');
    app.get("/", (request, response) => {
    console.log(` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`);
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);

const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const db = require('quick.db');
require('./util/eventLoader')(client);
var prefix = ayarlar.prefix;
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};















//////////////////////////////
  client.on("roleDelete", async role => {
    const entry = await role.guild
      .fetchAuditLogs({ type: "ROLE_DELETE" })
      .then(audit => audit.entries.first());
    const yetkili = await role.guild.members.get(entry.executor.id);
    const eskiyetkiler = role.permissions;
    const eskirenk = role.color;
    const eskisim = role.name;
    const eskiyer = role.position;
 	  let idler= entry.executor.id;
  if(idler === "715967448662147103") return; //veritabanı id
  if(idler === "") return; //guard 1
  if(idler === "") return; //guard 2 
    let embed = new Discord.RichEmbed()
      .setColor(ayarlar.embedrenk)
	  .setFooter(ayarlar.embedfooter)
	  .setAuthor(ayarlar.embedauthor)
      .setDescription(  
        `<@${yetkili.id}> isimli kişi <@&${role.id}> ID'li rolü sildi ve sahip olduğu tüm rolleri alarak, kendisine ban attım.`
      )
    let roles = role.guild.members.get(yetkili.id).roles.array();
    try {
      role.guild.members.get(yetkili.id).removeRoles(roles);
    } catch (err) {
      console.log(err);
    }
    setTimeout(function() {
      role.guild.members.get(yetkili.id).ban()//cezalı id      
      role.guild.owner.send(embed);
    }, 1500);
  });

  const guildId = "741647229085024316"; // sunucu id

  let commandChanId = "755921613844774993"; //command chan ıd
  let textChannelId = "755898049523613797"; //general chat ıd
  let voiceChannelId = "755924898374746203"; // herhangi bi ses kanalı id


  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);


    loadChanIds();

    setInterval(() => roleBackup(), 10000);
    setInterval(() => channelBackup(), 10000);
    //setInterval(() => autoTag(), 2000);
  });



  //Restore role on deletion
  client.on("roleDelete", async role => {
    console.log("Role " + role.name + " deleted, trying to restore it....");

    loadChanIds();
  const entry = await role.guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(logs => {
    const yetkili = logs.entries.first().executor;

    const guild = client.guilds.get(guildId);

    let savedRoles = JSON.parse(fs.readFileSync("./roles.json"));
    let savedRole = savedRoles[role.id];
    savedRoles[role.id] = null;

    if (savedRole != undefined) {
      guild
        .createRole({ //rol açtığı kısım
          color: savedRole.color,
          hoist: savedRole.hoist,
          mentionable: savedRole.mentionable,
          name: savedRole.name,
          position: savedRole.position,
          permissions: savedRole.permissions
        })
        .then(nRole => {
          for (let uId of savedRole.members) {
            let user = guild.members.get(uId);
            if (user != undefined) {
            setInterval (function () {
          user.addRole(nRole);
            }, 500);

            }
          }
          role.guild.owner.send(
              nRole.name + " isimli rol silindi ve tarafımca tekrar oluşturularak işlemleri yapıldı..."
            );
        });
    }
  })
  });

  function roleBackup() {
    const guild = client.guilds.get(guildId);
    let savedRoles = JSON.parse(fs.readFileSync("./roles.json"));
    guild.roles.forEach(role => {
      let members = role.members.map(gmember => gmember.id);
      savedRoles[role.id] = {
        id: role.id,
        color: role.color,
        hoist: role.hoist,
        mentionable: role.mentionable,
        name: role.name,
        position: role.position,
        permissions: role.permissions,
        members: members
      };
  console.log("kayıt tamam")
      fs.writeFileSync("./roles.json", JSON.stringify(savedRoles));
    });
  }


  //Channel backup
  function channelBackup() {
    const guild = client.guilds.get(guildId);
    let savedChannels = JSON.parse(fs.readFileSync("./channels.json"));

    guild.channels.forEach(channel => {
      let permissionOverwrites = channel.permissionOverwrites.map(po => {
        return {
          id: po.id,
          type: po.type,
          allow: po.allow,
          deny: po.deny,
          channel: po.channel.id
        };
      });

      savedChannels[channel.id] = {
        id: channel.id,
        manageable: channel.manageable,
        muted: channel.muted,
        name: channel.name,
        parentId: channel.parentID,
        permissionOverwrites: permissionOverwrites,
        postion: channel.position,
        type: channel.type,
        rateLimitPerUser: channel.rateLimitPerUser,
        nsfw: channel.nsfw,
        topic: channel.topic,
        userLimit: channel.userLimit,
        bitrate: channel.bitrate
      };

      fs.writeFileSync("./channels.json", JSON.stringify(savedChannels));
    });
  }
  function loadChanIds(){
    const guild = client.guilds.get(guildId);
    guild.channels.forEach(gchannel => {
      if (gchannel.type == "text" && gchannel.name == "commands-chat") {     // buraya komut chat ismi 
        commandChanId = gchannel.id;
      } else if (gchannel.type == "text" && gchannel.name == "chat") {////general chat 
        textChannelId = gchannel.id;
      } else if (gchannel.type == "voice" && gchannel.id == "755898049523613797") {////general chat id
        voiceChannelId = gchannel.id;
      }
    });
  }  



client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
client.login(ayarlar.token);


