export class Exclusively {

    /* object to store contexts */
    private static contexts: { [key: string]: Exclusively } = {};

    /* get "Exclusively" object if it exists else create */
    public static getContext(key: string): Exclusively {
        return this.contexts[key] ?? new Exclusively(key);
    }

    /* delete "Exclusively" object by key */
    public static removeContext(key: string): void {
        delete this.contexts[key];
    }

    /* exec() or fetch() will be not started until this Promise is resolved */
    private now: Promise<void>;

    /* create "Exclusively" object (if key is not undefined, it can be identified by key) */
    public constructor(key?: string) {
        this.now = Promise.resolve();

        if (key !== void 0) {
            Exclusively.contexts[key] = this;
        }
    }

    /* exec function exclusively */
    public async exec<T = any>(func: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {

            this.now = new Promise(settle => {
                this.now
                    .then(() => func())
                    .then(e => resolve(e))
                    .catch(e => reject(e))
                    .finally(() => settle());
                ;
            });
        });
    }

    /* fetch exclusively */
    public async fetch(...args: Parameters<typeof fetch>): Promise<Response> {
        return this.exec<Response>(() => globalThis.fetch(...args));
    }
}
