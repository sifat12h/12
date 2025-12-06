const axios = require("axios");

module.exports = {
  config: {
    name: "baby",
    version: "2.0.0",
    author: "Azadx69x",
    role: 0,
    shortDescription: "Baby Ai GF",
    longDescription: "Romantic chat",
    category: "ai",
    guide: { en: "baby-ai" }
  },

  API_URL: "https://azadx69x-baby-api.onrender.com/baby",

  chatHistories: {},

  async onStart() {},

  async onChat({ api, event }) {
    const { senderID, threadID, messageID, body, messageReply } = event;
    const text = body?.toLowerCase()?.trim();
    if (!text) return;

    const botID = api.getCurrentUserID();
      
    const triggerWords = ["baby", "babu", "bby", "sadiya", "bot", "nezuko", "jan", "azad"];

    const isTriggered = triggerWords.some(w => text.includes(w));
      
    const firstReplies = [
      "Bolo jaan ki korte pari apnar jonno!",
      "Assalamu Alaikum 💖",
      "Amake na deke amar boss azad er sathe prem kor😊",
      "bolo jaan 🥺",
      "🙄",
      "আরে Bolo আমার জান ,কেমন আছো?😚",
      "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🐸",
      "ইস কোনো মেয়ে যদি আমার Boss আজad কে একা পেয়ে খেয়ে দিতো..!🥺🦆",
      "হা বলো, শুনছি আমি 😏",
      "জান বাল ফালাইবা 🙂",
      "তোমার মেয়ে রাতে ভিদু কল দিতে বলে 🫣",
      "জান তুমি শুধু আমার 😽",
      "ভালোবাসা করতে চাইলে বস azad এর ইনবক্স যাও 🥱",
      "কতদিন বিছনায় মুতি না 😿",
      "দেশে সব চুরি হয় শুধু বস azad এর মন ছাড়া 😑",
      "তোমারে খুব ভাল লাগে, সময় মতো প্রপোজ করমু 😼",
      "আজ থেকে কাউকে পাত্তা দিমু না কারণ ফর্সা হওয়ার ক্রীম কিনছি 🙂",
      "বেশি Bot Bot করলে leave নিবো 😒",
      "আমি আবাল দের সাথে কথা বলি না 😒",
      "এতো কাছে এসো না প্রেম এ পরে যাবো 🙈"
    ];
      
    if (isTriggered && (!messageReply || messageReply.senderID !== botID)) {
      const reply = firstReplies[Math.floor(Math.random() * firstReplies.length)];
      return api.sendMessage(reply, threadID, messageID);
    }
      
    if (!messageReply || messageReply.senderID !== botID) return;
      
    if (!this.chatHistories[senderID]) this.chatHistories[senderID] = [];
    this.chatHistories[senderID].push(`User: ${body}`);

    if (this.chatHistories[senderID].length > 5)
      this.chatHistories[senderID].shift();

    const fullConversation = this.chatHistories[senderID].join("\n");

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
      const res = await axios.get(
        `${this.API_URL}?message=${encodeURIComponent(fullConversation)}`
      );

      const reply = res.data.reply || "Baby… say it clearly 😚💗";

      this.chatHistories[senderID].push(`Nezuko: ${reply}`);

      api.sendMessage(reply, threadID, messageID);
      api.setMessageReaction("🖤", messageID, () => {}, true);

    } catch (err) {
      api.sendMessage(
        "Baby API is down Please try again later❗",
        threadID,
        messageID
      );
      api.setMessageReaction("❌", messageID, () => {}, true);
    }
  }
};
