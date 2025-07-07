const fs = require('fs');
const path = require('path');
const activityFile = path.join(__dirname, '../data/usersActivity.json');

function getInactiveUsers(minDays = 7) {
  if (!fs.existsSync(activityFile)) return [];

  const data = JSON.parse(fs.readFileSync(activityFile, 'utf8'));
  const now = new Date();

  return Object.entries(data)
    .filter(([id, info]) => {
      if (!info.lastMessage) return true; // nunca ha enviado mensaje
      const last = new Date(info.lastMessage);
      const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      return diff >= minDays;
    })
    .map(([id, info]) => {
      if (!info.lastMessage) {
        return {
          id,
          daysInactive: 'Nunca ha enviado mensaje',
          messages: info.messageCount || 0
        };
      }

      const last = new Date(info.lastMessage);
      const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));

      return {
        id,
        daysInactive: diff,
        messages: info.messageCount
      };
    })
    .sort((a, b) => {
      const aDays = typeof a.daysInactive === 'number' ? a.daysInactive : Infinity;
      const bDays = typeof b.daysInactive === 'number' ? b.daysInactive : Infinity;
      return bDays - aDays;
    });
}

module.exports = { getInactiveUsers };
