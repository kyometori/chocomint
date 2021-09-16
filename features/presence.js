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
};

module.exports = client => {
  const presence = infArray(presenceArray);
  client.user.setActivity('chocomint ice', presence.next().value);
  setInterval(() => {
    client.user.setActivity('chocomint ice', presence.next().value);
  }, 15e3);
}
