const fs = require('fs');
const Osm2Json = require('osm2json');
const dotDelimiter = 10000;

const inputDataFile = '/Users/sarith21/Desktop/osm/vehicle-highways.osm.xml';
const rs = fs.createReadStream(inputDataFile);

const dataStream = rs.pipe(new Osm2Json());

var totalCount = 0;
var wayMissingHighway = 0;

const wayTags = {};

var counts = {
    bounds: 0,
    node: 0,
    way: 0,
    relation: 0
};

const objToSortedArray = (obj) => {

    const result = [];
    for(let key in obj) result.push({ key, count: obj[key] });
    result.sort((a, b) => b.count - a.count);
    return result;
};

const dataHandlers = {
    bounds: (bounds)=>{

        counts.bounds++;
        totalCount++;
        if(totalCount % dotDelimiter === 0) process.stdout.write('.');
    },
    node: (node)=>{

        counts.node++;
        totalCount++;
        if(totalCount % dotDelimiter === 0) process.stdout.write('.');
    },
    way: (way)=>{

        counts.way++;
        totalCount++;
        for(let key in way.tags) wayTags[key] = wayTags[key] ? wayTags[key] + 1 : 1;
        if(!way.tags || !way.tags.highway) wayMissingHighway++;
        if(totalCount % dotDelimiter === 0) process.stdout.write('.');
    },
    relation: (relation)=>{

        counts.relation++;
        totalCount++;
        if(totalCount % dotDelimiter === 0) process.stdout.write('.');
    }
};

dataStream.on('data', (obj) => {

    const type = obj.type;
    if(dataHandlers[type]) dataHandlers[type](obj);
});

dataStream.on('end', (obj) => {

    console.log('document end');
    console.log(counts);
    console.log(`Total count ${totalCount}`);
    console.log(objToSortedArray(wayTags));
    console.log(`Ways missing highway tag: ${wayMissingHighway}`);
});
