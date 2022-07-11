import { get_cached_data, add_cached_data } from "./utilities.js";

class CMC {
    constructor(
    ) {
        const self = this;

        this.cache_name = 'cmc_cache';

        this.listings_url = 'https://www.rhyzz.com/byu/get.php?user=naif&what=listings';

        this.get_listings().then(function (items) {
            self.listings = items;

            document.dispatchEvent(new Event("currencies_loaded"));
        });

        this.exchanges_url = 'https://www.rhyzz.com/byu/get.php?user=naif&what=exchanges';

        this.get_exchanges().then(function (items) {
            self.exchanges = items;

            document.dispatchEvent(new Event("exchanges_loaded"));
        });

        this.quotes = {};

        this.quotes_url = 'https://www.rhyzz.com/byu/get.php?user=naif&what=quotes&slug=';
    }

    async get_listings() {
        const url = this.listings_url;

        const data = await get_cached_data(this.cache_name, url);

        if (data) {
            return data;
        }

        return add_cached_data(this.cache_name, url);
    }

    async get_exchanges() {
        const url = this.exchanges_url;

        const data = await get_cached_data(this.cache_name, url);

        if (data) {
            return data;
        }

        return add_cached_data(this.cache_name, url);
    }

    async get_quotes(slug, force = false) {
        const url = this.quotes_url + slug;

        // If force is false (default), retrieve data from cache, otherwise make a fresh fetch
        if (force == false) {
            const data = await get_cached_data(this.cache_name, url);

            if (data) {
                return data;
            }
        }

        return add_cached_data(this.cache_name, url);

    }
}

export { CMC };