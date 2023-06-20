const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = process.env.SLACK_PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const slackClient = new WebClient(slackToken);

slackEvents.on('app_mention', async (event) => {
  console.log(`Got message from user ${event.text}`);
  try {
    await slackClient.chat.postMessage({ channel: event.channel, text: `Hello <@${event.user}>! :tada:` });
  } catch (error) {
    console.error(error.data);
  }
});

slackEvents.on('error', console.error);

slackEvents.start(port).then(() => {
  console.log(`Server started on port ${port}`);
}).catch((error) => {
  console.error('Error starting Slack Events API server:', error);
});
