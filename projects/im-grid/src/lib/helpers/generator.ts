export const randomUuid = (): string => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let random = Math.random() * 16;
        /* tslint:disable:no-bitwise */
        if (d > 0) {
            random = (d + random) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            random = (d2 + random) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
        /* tslint:enable:no-bitwise */
    });
};
