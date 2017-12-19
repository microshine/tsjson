export function assign(target: any, ...sources: any[]) {
    const res = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        // tslint:disable-next-line:forin
        for (const prop in obj) {
            res[prop] = obj[prop];
        }
    }
    return res;
}
