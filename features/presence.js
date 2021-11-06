const presenceArray = [
  { type: 'PLAYING' },
  { type: 'LISTENING' },
  { type: 'WATCHING' }
];

function* infArray(array) {
  let i = 0;
  while (true) {
    yield array[i++];
    i %= array.length;
  }
}

function randomUpper(text) {
  return text.split('').map(x => Math.random() > 0.5 ? x : x.toUpperCase()).join('')
}

module.exports = client => {
  const presence = infArray(presenceArray);
  client.user.setActivity(randomUpper('chocomint ice'), presence.next().value);
  setInterval(() => {
    client.user.setActivity(randomUpper('chocomint ice'), presence.next().value);
  }, 15e3);
}
