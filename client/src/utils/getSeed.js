export function getSeed(userId) {
    /* eslint-disable */
    const numericID = BigInt(`0x${userId}`);
    /* eslint-enable */

    const numericIDString = numericID.toString();

    const firstFourDigits = parseInt(numericIDString.slice(0, 4), 10);

    return firstFourDigits;
}