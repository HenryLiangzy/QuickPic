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

    /**
     * 
     * @param {String} path 
     * @param {JSON} option 
     * @returns Promise
     */
    makeAPIRequest(path, option) {
        
        return getJSON(`${this.url}/${path}`, option);
    }

    /** 
     * @param {String} path
     * @param {json} data 
     */
    sendPostRequest(path, data, token) {
        let option = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        }
        return getJSON(`${this.url}/${path}`, option);
    }

    /**
     * @param {String} path
     * @param {json} data
     */
    sendGetRequest(path, data, token) {
        let option = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        }
        return getJSON(`${this.url}/${path}`, option);
    }

    
    sendPutRequest(path, option){
        
    }
}
