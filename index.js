const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/strudel', async ({ command, ack, respond }) => {
  await ack();

  const code = command.text.trim();

  if (!code) {
    await respond('Usage: `/strudel <strudel code>`\nPaste your Strudel pattern and get a playable link back.');
    return;
  }

  const encoded = Buffer.from(code).toString('base64');
  const link = `https://strudel.tidalcycles.org/#${encoded}`;

  await respond({
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:musical_note: *Strudel pattern by <@${command.user_id}>*\n<${link}|Click to play in Strudel>`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `\`\`\`${code}\`\`\``
          }
        ]
      }
    ]
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('strudel-bot is running');
})();
