
/*
When done, must also run the following:
1. 
DELETE FROM nodes_to_ways q
WHERE EXISTS (
   SELECT 1
   FROM   nodes_to_ways q1
   WHERE  q1.ctid < q.ctid
   AND    q.node_id = q1.node_id
   AND    q.way_id = q1.way_id
);

2. 
CREATE INDEX nodes_to_ways_node_id ON nodes_to_ways (node_id);
CREATE INDEX nodes_to_ways_way_id ON nodes_to_ways (way_id); 
*/

const ProgressBar = require('progress');
const Promise = require('bluebird');
const bar = new ProgressBar('[:bar]:percent :eta s', { total: 958027/50, width: 100, renderThrottle: 200 });

const knex = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        database : 'roads_australia'
    }
});

let count = 0;

const wayFilePath = '/Users/sarith21/Desktop/osm/ways.json';

const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader(wayFilePath);
lr.on('error', (err) => console.log(err));
lr.on('end', () => console.log('done!', count));

let qs = [];

lr.on('line', function (line) {
    
    if(qs.length >= 50){

        lr.pause();

        return insertWays(qs)
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const insertWays = (wayLines) => {

    const nodeLinks = [];

    const ways = wayLines
    .map((wayLine) => JSON.parse(wayLine))
    .map((wayObj) => {

        wayObj.nodes.forEach((node_id) => nodeLinks.push({ node_id, way_id: wayObj.id }));

        return {
            id: wayObj.id,
            version: wayObj.version,
            name: (wayObj.tags && wayObj.tags.name) || null,
            highway_type_id: highwayTypes[wayObj.tags && wayObj.tags.highway] || null,
            max_speed: isNumeric(wayObj.tags && wayObj.tags.maxspeed) ? wayObj.tags.maxspeed : null
        };
    });

    return knex('ways').insert(ways)
    .then(() => knex('nodes_to_ways').insert(nodeLinks));
};

const highwayTypes = {
    motorway: 1,
    primary: 2,
    secondary: 3,
    tertiary: 4,
    residential: 5,
};

