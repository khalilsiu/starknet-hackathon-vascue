export const hashCode = (input: string) => {
    var hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
        chr = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const splitAndHash = (input: string) => {
    let index = 0;
    const arr = []
    while (index + 3 <= input.length) {
        let endIndex = index + 3;
        if (endIndex === input.length) {
            endIndex = input.length;
        }
        const split = input.slice(index, endIndex);
        arr.push(hashCode(split));
        index++;
    }
    return arr;
}

export const createHexArgs = (args: string[]) => {
    return args.reduce((acc, arg) => {
        acc.push(...splitAndHash(arg));
        return acc;
    }, [] as number[])
}

export const trimAddress = (address: string) => {
    return address.slice(0,5) + '...' + address.slice(-3)
}