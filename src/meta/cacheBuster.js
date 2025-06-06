'use strict';

const fs = require('fs');
const path = require('path');
const { mkdirp } = require('mkdirp');
const winston = require('winston');

const filePath = path.join(__dirname, '../../build/cache-buster');

let cached;

// cache buster is an 11-character, lowercase, alphanumeric string
function generate() {
	const crypto = require('crypto');
	const length = 11;
	const generated = crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex').slice(0, length);
	return generated;
}

exports.write = async function write() {
	await mkdirp(path.dirname(filePath));
	await fs.promises.writeFile(filePath, generate());
};

exports.read = async function read() {
	if (cached) {
		return cached;
	}
	try {
		const buster = await fs.promises.readFile(filePath, 'utf8');
		if (!buster || buster.length !== 11) {
			winston.warn(`[cache-buster] cache buster string invalid: expected /[a-z0-9]{11}/, got \`${buster}\``);
			return generate();
		}

		cached = buster;
		return cached;
	} catch (err) {
		winston.warn('[cache-buster] could not read cache buster', err);
		return generate();
	}
};

require('../promisify')(exports);
