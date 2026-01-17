module.exports = {
  config: {
    name: "fork",
    aliases: ["repo"],
    version: "0.1",
    author: "Azadx69x",
    countDown: 3,
    role: 0,
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function({ message }) {
    const text = `✨ Goat Bot V2 — Updated x69x Bot V2 ✨

🔗 GitHub Repository:
https://github.com/ncazad/Azadx69x.git

💖 Thanks for using & supporting!`;

    message.reply(text);
  }
};
