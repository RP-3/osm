const fs = require('fs');
const Promise = require('bluebird');
const ProgressBar = require('progress');
const bar = new ProgressBar('[:bar] :percent :eta s', { total: 939200, width: 100, renderThrottle: 200 });

const pg = require('pg');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');

const { Client } = require('pg');
const pgClient = new Client({
    database: 'roads_australia',
    port: 5432
});

const qs = `SELECT id, name, highway_type_id, max_speed FROM ways;`;

const waysFile = '/Users/sarith21/Desktop/osm/redisWays.json';
const waysOutput = fs.createWriteStream(waysFile);

pgClient.connect(function(err, client, done) {

    if(err) throw err;

    var query = new QueryStream(qs);
    var stream = client.query(query);

    stream.on('data', (data) => {

        bar.tick();
        waysOutput.write(JSON.stringify(data) + '\n');
    });

    stream.on('end', () => {

        setTimeout(() => waysOutput.close(), 500);
        setTimeout(() => process.exit(0), 1000);
        if(typeof done === 'function') done();
    });
});
