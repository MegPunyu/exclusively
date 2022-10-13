/**
 * A class for executing async functions exclusively.
 */
export default class Exclusively {

    /**
     * An object to store contexts
     */
    private static contexts: { [key: string]: Exclusively } = {};

    /**
     * Returns an "Exclusively" object. If the object corresponding to the key does not exist, it is created.
     * 
     * @param key the key of the context
     * @example
     * const context = Exclusively.getContext("sample");
     */
    public static getContext(key: string): Exclusively {
        return this.contexts[key] ?? new Exclusively(key);
    }

    /** 
     * Deletes "Exclusively" object by key.
     * 
     * @param key the key of the context
     * @example
     * const context1 = Exclusively.getContext("sample");
     * Exclusively.removeContext("sample");
     * const context2 = Exclusively.getContext("sample");  // new object
    */
    public static removeContext(key: string): void {
        delete this.contexts[key];
    }

    /**
     * Async procedures in exec() or fetch() are not started until this Promise is resolved.
     */
    private now: Promise<void>;

    /** 
     * Creates "Exclusively" object (if param "key" is not undefined, it can be identified by key).
     * 
     * @param key the key of the context
     * @example
     * const context1 = new Exclusively("sample");
     * const context2 = Exclusively.getContext("sample");  // same object as context1
     * 
     * new Exclusively("sample");  // the object corresponding to the key "sample" is replaced
     * const context3 = Exclusively.getContext("sample");  // different object from context1 and context2
     */
    public constructor(key?: string) {
        this.now = Promise.resolve();

        if (key !== void 0) {
            Exclusively.contexts[key] = this;
        }
    }

    /**
     * Calls an async function exclusively.
     * 
     * @param func functions to be called
     * @example
     * const wait3s = async () => new Promise(resolve => setTimeout(() => {
     *     console.log("3s");
     *     resolve();
     * }, 3000));
     *
     * // print "3s" three times every three seconds. 
     * const context = new Exclusively();
     * 
     * // execution time
     * context.exec(wait3s);  // |---|
     * context.exec(wait3s);  //     |---|
     * context.exec(wait3s);  //         |---|
     */
    public async exec<T = unknown>(func: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {

            this.now = new Promise(settle => {
                this.now
                    .then(() => func())
                    .then(e => resolve(e))
                    .catch(e => reject(e))
                    .finally(() => settle());

            });
        });
    }

    /**
     * Calls fetch() function exclusively. The parameter type is the same as that of JavaScript fetch() function.
     * 
     * @example
     * const request = new Request("https://example.com/");
     * const context = new Exclusively();
     * 
     *                          // Network waterfall (example)
     * context.fetch(request);  // |---|
     * context.fetch(request);  //     |-----|
     * context.fetch(request);  //           |----|
     */
    public async fetch(...args: Parameters<typeof fetch>): Promise<Response> {
        return this.exec<Response>(() => globalThis.fetch(...args));
    }
}
