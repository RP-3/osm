/*
When done must run

UPDATE nodes
SET postcode = (
    SELECT MAX(poa_code) as poa FROM poa_2011_aust
    WHERE ST_Contains(poa_2011_aust.geom, ST_SetSRID(ST_MakePoint(nodes.lon, nodes.lat), 0))
);
*/

const ProgressBar = require('progress');
const Promise = require('bluebird');
const bar = new ProgressBar('[:bar]:percent :eta s', { total: 11163754/100, width: 100, renderThrottle: 200 });

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        database : 'roads_australia'
    }
});

let count = 0;

const nodeFilePath = '/Users/sarith21/Desktop/osm/nodes.json';

const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader(nodeFilePath);
lr.on('error', (err) => console.log(err));
lr.on('end', () => console.log('done!', count));

let qs = [];

lr.on('line', function (line) {
    
    if(qs.length >= 100){

        lr.pause();

        return Promise.map(qs, formatInsertions)
        .then((insertions) => knex('nodes').insert(insertions))
        .then(() => {

            qs = [];
            bar.tick();
            return lr.resume();
        })
        .catch((err) => {

            console.log(err);
            qs = [];
            return lr.resume();
        });
    }else{

        count++;
        qs.push(line);
    }
});

const formatInsertions = (nodeLine) => {

    const node = JSON.parse(nodeLine);

    return {
        lat: node.lat,
        lon: node.lon,
        id: node.id,
        version: node.version,
        postcode: null
    };
};
