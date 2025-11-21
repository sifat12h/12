const axios = require("axios");

module.exports = {
config: {
name: "album",
aliases: ["al"],
version: "1.0.4",
author: "Azadx69x",//Author change korle tor marechudi 
countDown: 2,
role: 0,
shortDescription: "Stylish Album list & viewer",
longDescription: "Reply with a number to get a video",
category: "media"
},

onStart: async function ({ message, event, args }) {
const displayNames = [
"𝐀𝐧𝐢𝐦𝐞 💫",
"𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 😼",
"𝐁𝐚𝐛𝐲 👶",
"𝐂𝐚𝐭 🐈",
"𝐂𝐨𝐮𝐩𝐥𝐞 💑",
"𝐃𝐫𝐚𝐠𝐨𝐧𝐁𝐚𝐥𝐥 🐉",
"𝐅𝐥𝐨𝐰𝐞𝐫 🌺",
"𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 ⚽",
"𝐅𝐫𝐢𝐞𝐧𝐝𝐬 🫂",
"𝐅𝐫𝐞𝐞𝐅𝐢𝐫𝐞 👅",
"𝐅𝐮𝐧𝐧𝐲 🤣",
"𝐇𝐨𝐫𝐧𝐲 💦",
"𝐇𝐨𝐭 🥵",
"𝐈𝐬𝐥𝐚𝐦𝐢𝐜 😊",
"𝐋𝐨𝐅𝐈 🎶",
"𝐋𝐨𝐯𝐞 💝",
"𝐋𝐲𝐫𝐢𝐜𝐬 🎵",
"𝐍𝐚𝐫𝐮𝐭𝐨 🌟",
"𝐒𝐚𝐝 😿",
"𝐀𝐨𝐓 ⚡"
];

const realCategories = [  
  "anime", "attitude", "baby", "cat", "couple", "dragonball", "flower", "football",  
  "friends", "freefire", "funny", "horny", "hot", "islamic", "lofi", "love",  
  "lyrics", "naruto", "sad", "aot"  
];  

const itemsPerPage = 10;  
const page = parseInt(args[0]) || 1;  
const totalPages = Math.ceil(displayNames.length / itemsPerPage);  

if (page < 1 || page > totalPages) {  
  return message.reply(`❌ Invalid page! Choose 1-${totalPages}.`);  
}  

const startIndex = (page - 1) * itemsPerPage;  
const endIndex = startIndex + itemsPerPage;  
const categoriesToShow = displayNames.slice(startIndex, endIndex);  

let text = "🐥 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨 𝐋𝐢𝐬𝐭 🐤\n";  
text += "╔═════════════════╗\n";  
categoriesToShow.forEach((cat, i) => {  
  text += `║ ${startIndex + i + 1}. ${cat}\n`;  
});  
text += "╚═════════════════╝\n";  
text += `📶 | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]\n`;  
if (page < totalPages) text += `ℹ | Type !album ${page + 1} to see next page\n`;  
text += "📝 | Reply a number to get a video.";  

const sent = await message.reply(text);  

global.GoatBot.onReply.set(sent.messageID, {  
  commandName: module.exports.config.name,  
  author: event.senderID,  
  startIndex,  
  displayNames,  
  realCategories,  
  messageID: sent.messageID
});

},

onReply: async function ({ message, Reply, event }) {
if (event.senderID !== Reply.author) return;

const num = parseInt(event.body.trim());  
const index = num - 1;  

if (isNaN(num) || index < Reply.startIndex || index >= Reply.displayNames.length) {  
  return message.reply("❌ Invalid number. Reply with a valid number from the list.");  
}  

const category = Reply.realCategories[index];  

try {  
  const link = `https://azadx69x-album-api.onrender.com/api/album?category=${encodeURIComponent(category)}`;  
  const res = await axios.get(link);  

  if (!res.data || !res.data.url) {  
    return message.reply(`❌ No videos found for ${Reply.displayNames[index]}`);  
  }  

  try {  
    await message.unsend(Reply.messageID);  
  } catch(e){ console.log(e) }  

  await message.reply({  
    body: `𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 : ${Reply.displayNames[index]} 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲`,  
    attachment: await global.utils.getStreamFromURL(res.data.url)  
  });  

} catch (e) {  
  return message.reply("❌ API error or server offline. Try again later.");  
}

}
};
