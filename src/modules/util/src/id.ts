import { randomBytes } from 'crypto';

export function generateShortUid(): string {
    return randomBytes(4).toString('hex'); // Generate a short UID
}
