const fs = require('fs');
const Promise = require('bluebird');
const ProgressBar = require('progress');
const bar = new ProgressBar('[:bar] :percent :eta s', { total: 10848487, width: 100, renderThrottle: 200 });

const pg = require('pg');
const QueryStream = require('pg-query-stream');
const JSONStream = require('JSONStream');

const { Client } = require('pg');
const pgClient = new Client({
    database: 'roads_australia',
    port: 5432
});

const qs = `
SELECT
    nodes.id as id,
    max(nodes.lat) as lat,
    max(nodes.lon) as lon,
    max(nodes.postcode) as postcode,
    array_agg(DISTINCT nodes_to_ways.way_id) as way_ids
FROM nodes
INNER JOIN nodes_to_ways ON nodes.id = nodes_to_ways.node_id
GROUP BY nodes.id;
`;

const nodeFile = '/Users/sarith21/Desktop/osm/redisNodes.json';
const nodeOutput = fs.createWriteStream(nodeFile);

pgClient.connect(function(err, client, done) {

    if(err) throw err;

    var query = new QueryStream(qs);
    var stream = client.query(query);

    stream.on('data', (data) => {

        bar.tick();
        nodeOutput.write(JSON.stringify(data) + '\n');
    });

    stream.on('end', () => {

        setTimeout(() => nodeOutput.close(), 500);
        setTimeout(() => process.exit(0), 1000);
        if(typeof done === 'function') done();
    });
});
