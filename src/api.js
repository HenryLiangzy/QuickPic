/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
 const getJSON = (path, options) => 
 fetch(path, options)
     .then(res => res.json())
     .catch(err => console.warn(`API_ERROR: ${err.message}`));


/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    } 

    /** @param {String} path */
    makeAPIRequest(path) {
        return getJSON(`${this.url}/${path}`);
    }

    /** 
     * @param {String} path
     * @param {json} data 
     */
    sendPostRequest(path, data) {
        let option = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        return getJSON(`${this.url}/${path}`, option);
    }

    /**
     * @param {String} path
     * @param {json} data
     */
    sendGetRequest(path, data) {
        
    }
}
