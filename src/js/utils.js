export function transformTextContent(content) {
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
  return content.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
}

export function buildMessageDate(timestamp) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

export function extractCommandName(message) {
  const commandParts = message.split('@chaos:');
  if (!commandParts[1]) {
    return '';
  }

  return commandParts[1].trim().toLowerCase();
}
