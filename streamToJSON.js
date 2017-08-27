const fs = require('fs');
const Osm2Json = require('osm2json');
const dotDelimiter = 10000;

const inputDataFile = '/Users/sarith21/Desktop/osm/vehicle-highways3.osm.xml';
const nodeFile = '/Users/sarith21/Desktop/osm/nodes.json';
const wayFile = '/Users/sarith21/Desktop/osm/ways.json';

const rs = fs.createReadStream(inputDataFile);
const dataStream = rs.pipe(new Osm2Json());

const nodeOutput = fs.createWriteStream(nodeFile);
const wayOutput = fs.createWriteStream(wayFile);

const dataHandlers = {
    node: (node)=> nodeOutput.write(JSON.stringify(node) + '\n'),
    way: (way)=> wayOutput.write(JSON.stringify(way) + '\n')
};

dataStream.on('data', (obj) => {
    const type = obj.type;
    if(dataHandlers[type]) dataHandlers[type](obj);
});

dataStream.on('end', (obj) => {

    setTimeout(() => nodeOutput.close(), 1000);
    setTimeout(() => wayOutput.close(), 1000);
    setTimeout(() => process.exit(0), 1200);
});

dataStream.on('error', (err) => {
    console.log(err);
});

// { bounds: 1, node: 4598174, way: 615285, relation: 38924 }

/*
[ { key: 'highway', count: 615285 },
  { key: 'name', count: 555366 },
  { key: 'source', count: 213500 },
  { key: 'maxspeed', count: 167980 },
  { key: 'oneway', count: 150749 },
  { key: 'surface', count: 141622 },
  { key: 'lanes', count: 46746 },
  { key: 'source:name', count: 43526 },
  { key: 'ref', count: 41563 },
  { key: 'junction', count: 21126 },
  { key: 'bridge', count: 15293 },
  { key: 'layer', count: 15029 },
  { key: 'cycleway', count: 13500 },
  { key: 'network', count: 13180 },
  { key: 'source:name:date', count: 9417 },
  { key: 'source:maxspeed', count: 9239 },
  { key: 'fixme', count: 9030 },
  { key: 'lit', count: 8681 },
  { key: 'maxspeed:source', count: 8636 },
  { key: 'bicycle', count: 6264 },
  { key: 'access', count: 4515 },
  { key: 'smoothness', count: 4361 },
  { key: 'alt_name', count: 4268 },
  { key: 'sidewalk', count: 4205 },
  { key: 'is_in:suburb', count: 3879 },
  { key: 'note', count: 3822 },
  { key: 'foot', count: 3776 },
  { key: 'source:geometry', count: 3729 },
  { key: 'lcn', count: 3564 },
  { key: 'is_in', count: 3538 },
  { key: 'tracktype', count: 3474 },
  { key: 'postal_code', count: 3400 },
  { key: 'created_by', count: 2955 },
  { key: 'old_ref', count: 2946 },
  { key: 'old_network', count: 2548 },
  { key: 'motor_vehicle', count: 2415 },
  { key: 'attribution', count: 2215 },
  { key: 'cycleway:left', count: 1651 },
  { key: 'source:location', count: 1530 },
  { key: 'turn:lanes', count: 1452 },
  { key: 'ref:start_date', count: 1421 },
  { key: 'destination', count: 1265 },
  { key: 'old_name', count: 1204 },
  { key: 'width', count: 981 },
  { key: 'maxheight', count: 917 },
  { key: 'maxweight', count: 915 },
  { key: 'toll', count: 885 },
  { key: 'lanes:forward', count: 829 },
  { key: 'shoulder', count: 798 },
  { key: 'horse', count: 770 },
  { key: 'myid', count: 769 },
  { key: 'lanes:backward', count: 752 },
  { key: 'noname', count: 708 },
  { key: 'restriction', count: 695 },
  { key: 'source_ref:name', count: 664 },
  { key: 'website', count: 516 },
  { key: 'addr:city', count: 500 },
  { key: 'noref', count: 478 },
  { key: 'bridge_number', count: 466 },
  { key: 'odbl', count: 451 },
  { key: 'overtaking', count: 441 },
  { key: 'rcn', count: 440 },
  { key: 'construction', count: 422 },
  { key: 'transit:lanes', count: 411 },
  { key: 'source:date', count: 387 },
  { key: 'source_ref', count: 365 },
  { key: 'name:source', count: 358 },
  { key: 'maxspeed:restriction', count: 341 },
  { key: 'bridge:name', count: 341 },
  { key: 'restriction_hours', count: 338 },
  { key: 'abutters', count: 337 },
  { key: 'operator', count: 328 },
  { key: 'survey', count: 311 },
  { key: 'maxspeed:variable', count: 311 },
  { key: 'shoulder:surface', count: 310 },
  { key: 'shoulder:width', count: 306 },
  { key: 'addr:street', count: 297 },
  { key: 'boundary', count: 287 },
  { key: 'service', count: 254 },
  { key: 'tunnel', count: 250 },
  { key: 'loc_name', count: 249 },
  { key: 'incline', count: 237 },
  { key: 'traffic_calming', count: 228 },
  { key: 'is_in:hamlet', count: 228 },
  { key: 'history', count: 225 },
  { key: 'ford', count: 217 },
  { key: 'FIXME', count: 217 },
  { key: 'admin_ref', count: 211 },
  { key: 'is_in:town', count: 211 },
  { key: 'is_in:shire', count: 207 },
  { key: 'ncn', count: 202 },
  { key: 'is_in:farm', count: 200 },
  { key: 'source:bridge', count: 190 },
  { key: 'turn:lanes:backward', count: 186 },
  { key: 'turn:lanes:forward', count: 185 },
  { key: 'source:ref', count: 176 },
  { key: 'source:cycleway', count: 175 },
  { key: 'parking:lane:both:parallel', count: 174 },
  { key: 'destination:forward', count: 172 },
  { key: 'wikipedia', count: 165 },
  ... 556 more items ]
*/