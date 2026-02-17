module.exports = {
  config: {
    name: "out",
    version: "0.0.7",
    author: "Azadx69x",
    countDown: 5,
    role: 0,
    shortDescription: "Bot leave group with confirmation",
    longDescription: "Leave command restricted to a specific user.",
    category: "boxchat",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message, commandName }) {
    try {
      const allowedUID = "61585772322631";
      
      if (event.senderID !== allowedUID) {
        return message.reply(
          "𝐋𝐢𝐬𝐭𝐞𝐧 𝐛𝐫𝐨, 𝐮𝐬𝐢𝐧𝐠 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐛𝐞𝐢𝐧𝐠 𝐚𝐧 𝐚𝐝𝐦𝐢𝐧? 𝐀𝐫𝐞 𝐲𝐨𝐮 𝐨𝐮𝐭 𝐨𝐟 𝐲𝐨𝐮𝐫 𝐦𝐢𝐧𝐝? 🤣"
        );
      }
      
      message.reply(
        "🤔 𝐋𝐞𝐚𝐯𝐞 𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐚𝐭𝐢𝐨𝐧 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝\n\n" +
        "🙂 𝐀𝐫𝐞 𝐲𝐨𝐮 𝐬𝐮𝐫𝐞 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐦𝐞 𝐭𝐨 𝐥𝐞𝐚𝐯𝐞 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩?\n\n" +
        "🟢 𝐓𝐲𝐩𝐞 𝐘𝐞𝐬\n" +
        "🔴 𝐓𝐲𝐩𝐞 𝐍𝐨\n\n" +
        "⏳ 𝐀𝐮𝐭𝐨-𝐜𝐚𝐧𝐜𝐞𝐥 𝐢𝐧 20 𝐬𝐞𝐜𝐨𝐧𝐝𝐬.",
        (err, info) => {
          if (err) return console.error(err);

          global.GoatBot.onReply.set(info.messageID, {
            type: "leaveConfirm",
            author: event.senderID,
            messageID: info.messageID,
            threadID: event.threadID,
            commandName,
            timeout: setTimeout(() => {
              api.unsendMessage(info.messageID);
              global.GoatBot.onReply.delete(info.messageID);
            }, 20000)
          });
        }
      );

    } catch (error) {
      console.error("Error in onStart:", error);
      message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐥𝐞𝐚𝐯𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.");
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    if (!Reply || event.senderID !== Reply.author) return;

    clearTimeout(Reply.timeout);
    global.GoatBot.onReply.delete(Reply.messageID);

    const answer = event.body.trim().toLowerCase();

    if (answer === "yes") {
      await message.reply(
        "🥀 𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐞𝐝!\n" +
        "𝐋𝐞𝐚𝐯𝐢𝐧𝐠 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩 𝐬𝐡𝐨𝐫𝐭𝐥𝐲...\n\n" +
        "🤍 𝐀𝐥𝐥𝐚𝐡 𝐇𝐚𝐟𝐞𝐳!"
      );

      setTimeout(() => {
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.threadID)
          .catch(err => console.error("Failed to leave group:", err));
      }, 2000);

    } else {
      await message.reply(
        "🐸 𝐀𝐜𝐭𝐢𝐨𝐧 𝐂𝐚𝐧𝐜𝐞𝐥𝐥𝐞𝐝\n" +
        "𝐈 𝐰𝐢𝐥𝐥 𝐬𝐭𝐚𝐲 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 🙂"
      );
    }

    api.unsendMessage(Reply.messageID).catch(() => {});
  }
};
