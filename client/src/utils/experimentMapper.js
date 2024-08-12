export function generateDataset(data, seed) {
    const rng = new RNG(seed);
    const getItem = (e) => {
        const meaningID = rng.nextRange(0, 2);
        const trial = e.meanings[meaningID];
        return {
            wordID: e.wordID,
            word: e.word,
            meaningID: meaningID,
            context: trial.context,
            words: shuffleArray(trial.words)
        };
    };
    return shuffleArray(data.map(getItem), seed);
}

class RNG {
    constructor(seed) {
        this.m = 0x80000000; // 2**31;
        this.a = 1103515245;
        this.c = 12345;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    nextFloat() {
        return this.nextInt() / (this.m - 1);
    }

    nextRange(start, end) {
        var rangeSize = end - start;
        var randomUnder1 = this.nextInt() / this.m;
        return start + Math.floor(randomUnder1 * rangeSize);
    }

    choice(array) {
        return array[this.nextRange(0, array.length)];
    }
}


function shuffleArray(unshuffled, seed) {
    const rng = new RNG(seed);
    return unshuffled
        .map(value => ({ value, sort: rng.nextFloat() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}