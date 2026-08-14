require('dotenv').config();
const dns = require('node:dns');
const mongoose = require('mongoose');
const User = require('./models/User');

if (process.env.DNS_SERVERS) {
  const dnsServers = process.env.DNS_SERVERS
    .split(',')
    .map(server => server.trim())
    .filter(Boolean);
  if (dnsServers.length > 0) dns.setServers(dnsServers);
}

const email = String(process.argv[2] || 'admin@luckytravel.com').trim().toLowerCase();

const readHidden = prompt => new Promise((resolve, reject) => {
  if (!process.stdin.isTTY) {
    reject(new Error('Run this command in an interactive terminal.'));
    return;
  }

  let value = '';
  const stdin = process.stdin;
  process.stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  const cleanup = () => {
    stdin.setRawMode(false);
    stdin.pause();
    stdin.removeListener('data', onData);
  };

  const onData = key => {
    if (key === '\u0003') {
      cleanup();
      process.stdout.write('\n');
      reject(new Error('Password reset cancelled.'));
      return;
    }
    if (key === '\r' || key === '\n') {
      cleanup();
      process.stdout.write('\n');
      resolve(value);
      return;
    }
    if (key === '\u0008' || key === '\u007f') {
      if (value.length > 0) {
        value = value.slice(0, -1);
        process.stdout.write('\b \b');
      }
      return;
    }
    if (key >= ' ') {
      value += key;
      process.stdout.write('*');
    }
  };

  stdin.on('data', onData);
});

const resetPassword = async () => {
  try {
    const password = await readHidden(`New password for ${email}: `);
    if (password.length < 8) throw new Error('Password must contain at least 8 characters.');

    const confirmation = await readHidden('Confirm new password: ');
    if (password !== confirmation) throw new Error('Passwords do not match.');

    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email });
    if (!user) throw new Error(`No user found for ${email}.`);

    user.password = password;
    await user.save();
    console.log(`Password reset successfully for ${email}.`);
  } catch (error) {
    console.error(`Password reset failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

resetPassword();
