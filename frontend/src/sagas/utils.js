export function promisifiedAsyncCall(asyncFunction) {
    return new Promise(function(resolve, reject) {
        const cb = function(err, ...data) {
            if (err)
                reject(err);
            else 
                resolve(...data);
        }
        asyncFunction(cb);
    })
}