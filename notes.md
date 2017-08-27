# Direct OSM Extract
### Latest Australia map
curl "http://download.geofabrik.de/australia-oceania/australia-latest.osm.pbf" -o "australia.osm.pbf"

### Install osmosis
brew install osmosis

### Extract all drivable roads
osmosis --read-pbf australia.osm.pbf --way-key-value keyValueList="highway.bridleway,highway.emergency_access_point,highway.give_way,highway.incline_steep,highway.living_street,highway.mini_roundabout,highway.motorway,highway.motorway_junction,highway.motorway_link,highway.passing_place,highway.path,highway.platform,highway.primary,highway.primary_link,highway.raceway,highway.residential,highway.rest_area,highway.road,highway.safe_t_cam,highway.secondary,highway.secondary_link,highway.stop,highway.stopping_bay,highway.tertiary,highway.tertiary_link,highway.track,highway.traffic_sign,highway.traffic_signals,highway.traffic_signals,highway.trunk,highway.trunk_link,highway.turning_circle,highway.turning_loop,highway.unclassified" --used-node --write-xml vehicle-highways.osm.xml

Note: had to use `sed -e 'LINE_NUMBERd' vehicle-highways2.osm.xml > vehicle-highways3.osm.xml` to clean
up a row that looked like `<tag k="fixme" v=""/>`

### Parse XML to NDJSON
node streamToJSON.js

### Load nodes to Postgres
node loadNodesToPostgres.js

### Load ways to Postgres
node loadWaysToPostgres.js

### Extract Redis nodes index from Postgres to NDJSON
node extractRedisNodesIndex.js

### Extract Redis ways index from Postgres to NDJSON
node extractRedisWaysIndex.js

highway.bridleway,highway.emergency_access_point,highway.give_way,highway.incline_steep,highway.living_street,highway.mini_roundabout,highway.motorway,highway.motorway_junction,highway.motorway_link,highway.passing_place,highway.path,highway.platform,highway.primary,highway.primary_link,highway.raceway,highway.residential,highway.rest_area,highway.road,highway.safe_t_cam,highway.secondary,highway.secondary_link,highway.stop,highway.stopping_bay,highway.tertiary,highway.tertiary_link,highway.track,highway.traffic_sign,highway.traffic_signals,highway.traffic_signals,highway.trunk,highway.trunk_link,highway.turning_circle,highway.turning_loop,highway.unclassified