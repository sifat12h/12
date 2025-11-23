const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const GIFEncoder = require("gifencoder");

module.exports = {
  config: {
    name: "uid",
    version: "5.0",
    author: "Azadx69x",//Author change korle tor marechudi 
    role: 0,
    countDown: 5,
    description: { en: "UID card" },
    category: "info",
    guide: { en: "{pn} @tag / reply / link / self" }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      let targetUID = event.senderID;
      let username = await usersData.getName(targetUID) || "Unknown User";

      if (event.messageReply) {
        targetUID = event.messageReply.senderID;
        username = await usersData.getName(targetUID);
      } else if (Object.keys(event.mentions).length > 0) {
        targetUID = Object.keys(event.mentions)[0];
        username = event.mentions[targetUID].replace("@", "");
      }

      const width = 300;
      const height = 200;
      const frames = 30;
      const delay = 60;
      const outputPath = path.join(__dirname, `uid_premium_${Date.now()}.gif`);
      const encoder = new GIFEncoder(width, height);
      const writeStream = fs.createWriteStream(outputPath);
      encoder.createReadStream().pipe(writeStream);
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(delay);
      encoder.setQuality(10);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const avatarURL = await usersData.getAvatarUrl(targetUID);
      const avatar = await loadImage(avatarURL);

      function roundRect(ctx, x, y, w, h, r) {
        const min = Math.min(w, h) / 2;
        if (r > min) r = min;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      for (let f = 0; f < frames; f++) {
        const t = f / frames;
        const pulse = (Math.sin(t * Math.PI * 2) + 1) / 2;
        const hue = Math.floor((t * 360));
        const tilt = Math.sin(t * Math.PI * 2) * 0.06;
        const glowBlurOuter = 8 + pulse * 22;
        const glowBlurInner = 4 + pulse * 10;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = "#0f1720";
        ctx.fillRect(0, 0, width, height);

        const grad = ctx.createLinearGradient(0, 0, width, height);
        const h1 = `hsl(${hue}, 95%, 60%)`;
        const h2 = `hsl(${(hue + 60) % 360}, 95%, 55%)`;
        const h3 = `hsl(${(hue + 180) % 360}, 95%, 50%)`;
        grad.addColorStop(0, h1);
        grad.addColorStop(0.5, h2);
        grad.addColorStop(1, h3);

        ctx.save();
        const cx = width / 2;
        const cy = height / 2;
        ctx.translate(cx, cy);
        ctx.transform(1, -tilt * 0.8, tilt * 0.6, 1, 0, 0);
        ctx.translate(-cx, -cy);

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 20 + pulse * 10;
        roundRect(ctx, 18, 18, width - 36, height - 36, 14);
        ctx.fillStyle = "#081018";
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 6;
        ctx.strokeStyle = grad;
        ctx.shadowColor = grad;
        ctx.shadowBlur = glowBlurOuter;
        roundRect(ctx, 20, 20, width - 40, height - 40, 12);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.shadowColor = grad;
        ctx.shadowBlur = glowBlurInner;
        roundRect(ctx, 24, 24, width - 48, height - 48, 10);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        const cardGrad = ctx.createLinearGradient(20, 20, width - 20, height - 20);
        cardGrad.addColorStop(0, "rgba(255,255,255,0.02)");
        cardGrad.addColorStop(1, "rgba(0,0,0,0.25)");
        roundRect(ctx, 26, 26, width - 52, height - 52, 10);
        ctx.fillStyle = cardGrad;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(26, 36);
        ctx.lineTo(width - 26, 36);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.stroke();
        ctx.restore();

        const avX = 30;
        const avY = 30;
        const avSize = 60;
        ctx.save();
        const cxAv = avX + avSize / 2;
        const cyAv = avY + avSize / 2;
        ctx.beginPath();
        ctx.arc(cxAv, cyAv, avSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, avX, avY, avSize, avSize);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cxAv, cyAv, avSize / 2 + 4, 0, Math.PI * 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = grad;
        ctx.shadowColor = grad;
        ctx.shadowBlur = 10 + pulse * 18;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cxAv, cyAv, avSize / 2 + 8, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = grad;
        ctx.font = "18px Sans-serif";
        ctx.fillText(username, 105, 50);
        ctx.globalAlpha = 0.18 + pulse * 0.3;
        ctx.fillRect(105, 58, ctx.measureText(username).width, 4);
        ctx.globalAlpha = 1;
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "14px Sans-serif";
        ctx.fillText("Your UID", 105, 84);
        ctx.restore();

        ctx.save();
        ctx.font = "18px Sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = grad;
        ctx.shadowBlur = 4 + pulse * 8;
        ctx.fillText(targetUID.toString(), 105, 106);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = grad;
        ctx.shadowColor = grad;
        ctx.shadowBlur = 6 + pulse * 12;
        ctx.beginPath();
        ctx.arc(width - 34, height - 34, 4 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const bdTime = new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Dhaka",
          hour12: true
        });

        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.font = "10px Sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(bdTime, width - 40, height - 28);
        ctx.restore();

        ctx.restore();
        encoder.addFrame(ctx);
      }

      encoder.finish();

      writeStream.on("finish", () => {
        api.sendMessage(
          {
            body: `┌─────────────────────
│  ✨ PREMIUM UID CARD ✨
├─────────────────────
│ 👤 User : ${username}
│ 🆔 UID  : ${targetUID}
│ 👑 Author: Azadx69x
└─────────────────────`,
            attachment: fs.createReadStream(outputPath)
          },
          event.threadID,
          () => fs.unlink(outputPath, () => {})
        );
      });

    } catch (err) {
      console.error("UID PREMIUM ERROR:", err);
      api.sendMessage("❌ Failed to generate UID card.", event.threadID);
    }
  }
};
