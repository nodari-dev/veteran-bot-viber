'use strict';

require('dotenv').config();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const TextMessage = require('viber-bot').Message.Text;
const UrlMessage = require('viber-bot').Message.Url;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

const ngrok = require('./get_public_url');

const bot = new ViberBot({
  authToken: process.env.ACCESS_TOKEN,
  name: "E-Ветеран Бот",
  avatar: "https://developers.viber.com/docs/img/stickers/40122.png" // It is recommended to be 720x720, and no more than 100kb.
});

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
  const keyboard = {
    Type: 'keyboard',
    ButtonsGroupRows: ``,
    BgColor: "#FFFFFF",
    Buttons: [
      {
        ActionType: 'reply',
        ActionBody: 'start',
        Text: 'Розпочати',
      },
    ],
  };

  bot.sendMessage(userProfile, [
    new TextMessage("some name"),
    new KeyboardMessage(keyboard)
  ]);

  onFinish();
});

bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  console.log(message)
  if(message.text === "start"){
    response.send(new TextMessage("Привіт!"))
  }
});


bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));

// Server
if (process.env.NOW_URL || process.env.HEROKU_URL) {
  const http = require('http');
  const port = process.env.PORT || 5000;

  http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
  return ngrok.getPublicUrl().then(publicUrl => {
    const http = require('http');
    const port = process.env.PORT || 5000;

    console.log('publicUrl => ', publicUrl);

    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

  }).catch(error => {
    console.log('Can not connect to ngrok server. Is it running?');
    console.error(error);
    process.exit(1);
  });
}