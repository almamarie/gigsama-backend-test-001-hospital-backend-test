import crypto from 'crypto';

import { v4 as uuidv4 } from 'uuid';

const generateId = () => {
  const uniqueId = uuidv4().substring(0, 10);
  return hashUUID(uniqueId);
};

function hashUUID(uuid: string) {
  const hash = crypto.createHash('sha256');
  hash.update(uuid);
  const digest = hash.digest('hex');
  return digest.substring(0, 15);
}

export default generateId;
