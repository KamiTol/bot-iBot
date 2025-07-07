const fs = require('fs');
const path = require('path');
const activityPath = path.join(__dirname, '../data/usersActivity.json');

function updateUserActivity(userId, date = new Date()) {
  if (!fs.existsSync(activityPath)) {
    fs.writeFileSync(activityPath, '{}');
  }

  const data = JSON.parse(fs.readFileSync(activityPath, 'utf8'));

  if (!data[userId]) {
    data[userId] = {
      messageCount: 1,
      lastMessage: date.toISOString()
    };
  } else {
    data[userId].messageCount++;
    data[userId].lastMessage = date.toISOString();
  }

  fs.writeFileSync(activityPath, JSON.stringify(data, null, 2));
}

module.exports = { updateUserActivity };
