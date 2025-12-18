const axios = require("axios");

const API_URL = "https://azadx69x-amv-top.onrender.com";

async function getStream(url) {
  const res = await axios.get(url, {
    responseType: "stream",
    timeout: 300000
  });
  return res.data;
}

function getVideoURL(item) {
  if (item.downloaded?.filename)
    return `${API_URL}/videos/${item.downloaded.filename}`;

  if (item.video)
    return item.video;

  if (item.url)
    return item.url;

  return null;
}

module.exports = {
  config: {
    name: "anisearch",
    aliases: ["amv", "anisr"],
    author: "Azadx69x",
    version: "1.0",
    category: "edit",
    shortDescription: { en: "Anime AMV videos" },
    guide: { en: "{p}{n} [keyword]" },
    autoUnsendDelay: 5000
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    const queryText = args.join(" ").trim();
    const searchingMessage = await api.sendMessage(
      `🔍 Searching *${queryText || "AMV"}*...`,
      threadID,
      null,
      event.messageID
    );

    let unsendCalled = false;

    const safeUnsend = async () => {
      if (!unsendCalled) {
        unsendCalled = true;
        try {
          await api.unsendMessage(searchingMessage.messageID);
        } catch (e) {}
      }
    };
    
    const autoUnsendDelay = module.exports.config.autoUnsendDelay || 5000;
    setTimeout(safeUnsend, autoUnsendDelay);

    let query = queryText.toLowerCase();
    if (!query) query = "anime";

    try {
      const res = await axios.get(
        `${API_URL}/download?keyword=${encodeURIComponent(query)}`,
        { timeout: 300000 }
      );

      if (!res.data?.results?.length) {
        await safeUnsend();
        return api.sendMessage(
          "❌ | No AMV found",
          threadID,
          event.messageID
        );
      }

      const item = res.data.results[0];
      const videoUrl = getVideoURL(item);

      if (!videoUrl) {
        await safeUnsend();
        return api.sendMessage(
          "⚠️ | Video not ready on server",
          threadID,
          event.messageID
        );
      }

      const stream = await getStream(videoUrl);
      await api.sendMessage(
        { attachment: stream },
        threadID,
        null,
        event.messageID
      );

      await safeUnsend();

    } catch (err) {
      console.error("[AMV ERROR]", err.message);
      await safeUnsend();
      api.sendMessage(
        "❌ | Server / API error",
        threadID,
        event.messageID
      );
    }
  }
};
