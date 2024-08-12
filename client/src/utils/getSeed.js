const bigInt = require('big-integer');

export function getSeed(userId) {
    const numericID = bigInt(`0x${userId}`);

    const numericIDString = numericID.toString();

    const firstFourDigits = parseInt(numericIDString.slice(0, 4), 10);

    return firstFourDigits;
}