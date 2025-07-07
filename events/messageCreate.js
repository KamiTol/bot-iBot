const fs = require('fs');
const path = require('path');
const activityPath = path.join(__dirname, '../data/usersActivity.json');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    if (!fs.existsSync(activityPath)) {
      fs.writeFileSync(activityPath, '{}');
    }

    const data = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    const userId = message.author.id;

    if (!data[userId]) {
      data[userId] = {
        messageCount: 1,
        lastMessage: message.createdAt.toISOString()
      };
    } else {
      data[userId].messageCount++;
      data[userId].lastMessage = message.createdAt.toISOString();
    }

    fs.writeFileSync(activityPath, JSON.stringify(data, null, 2));
  }
};
