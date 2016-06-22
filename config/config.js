const port = process.env.PORT || 3000;

module.exports = {
    port,
    geoCode: {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        headers: { 'User-Agent': 'request' }
    },
    wikiMedia: {
        url: 'https://en.wikipedia.org/w/api.php',
        headers: { 'User-Agent': 'request' },
        qs: {
            action: 'query',
            format: 'json',
            prop: 'coordinates|pageimages',
            generator: 'geosearch',
            piprop: 'thumbnail',
            colimit: 50,
            pithumbsize: 144,
            pilimit: 50,
            ggsradius: 10000,
            ggslimit: 50
        }
    },
    auth: {
        user: 'admin',
        pass: 'pass'
    }
};