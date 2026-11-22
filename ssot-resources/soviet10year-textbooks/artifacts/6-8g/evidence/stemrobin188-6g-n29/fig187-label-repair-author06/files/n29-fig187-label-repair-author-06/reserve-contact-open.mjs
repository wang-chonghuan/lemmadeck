import path from 'node:path';
import assert from 'node:assert/strict';
import { R, OWN, bind, read, ledgerEvent } from './evidence.mjs';

assert.equal(process.cwd(), R);
assert.equal(read(path.join(OWN, 'image-ledger.json')).chargedImages, 7);
const contact = bind(path.join(OWN, 'contacts/fig-187.contact.png'));
assert.equal(read(path.join(OWN, 'contacts/fig-187.display.json')).contact.sha256, contact.sha256);
const ledger = ledgerEvent({ kind: 'single-contact-open', contact, charge: 1, method: 'functions.view_image next, once', status: 'reserved before actual open; completion is recorded in author-visual.json after inspection' });
console.log(JSON.stringify({ contact, chargedImages: ledger.chargedImages, remainingImageCharges: 0 }));
