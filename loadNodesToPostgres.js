const ProgressBar = require('progress');
const Promise = require('bluebird');
const bar = new ProgressBar('[:bar]:percent :eta s', { total: 4598174/50, width: 100, renderThrottle: 200 });

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        database : 'roads_australia'
    }
});

const boundryDb = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        database : 'boundries'
    }
});

const countDelimiter = 1000;
let count = 0;

const nodeFilePath = '/Users/sarith21/Desktop/osm/nodes.json';

const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader(nodeFilePath);
lr.on('error', (err) => console.log(err));
lr.on('end', () => console.log('done!', count));

let qs = [];

lr.on('line', function (line) {
    
    if(qs.length > 50){

        lr.pause();

        return Promise.map(qs, addPostcodeToNodeline)
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

const addPostcodeToNodeline = (nodeLine) => {

    const node = JSON.parse(nodeLine);
    return classifyCoordinates(node.lat, node.lon)
    .then((postcode) => ({
        lat: node.lat,
        lon: node.lon,
        id: node.id,
        version: node.version,
        postcode
    }));
};

const highwayTypes = {
    motorway: 1,
    primary: 2,
    secondary: 3,
    tertiary: 4,
    residential: 5,
};

const genQ = (long, lat) => `ST_Contains(poa_2011_aust.geom, ST_SetSRID(ST_MakePoint(${long},${lat}),0))`;

const classifyCoordinates = (lat, lon) => {

    return boundryDb
    .select('poa_code')
    .from('poa_2011_aust')
    .whereRaw(genQ(lon, lat))
    .then((datum) => datum.length ? datum[0].poa_code : null);
};
