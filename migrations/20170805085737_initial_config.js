
exports.up = function(knex, Promise) {

    return knex.schema.createTable('nodes', function(t){

        t.bigInteger('id')
            .primary()
            // .index();
        t.integer('version');
        t.specificType('lat', 'numeric(10,8)');
        t.specificType('lon', 'numeric(11,8)');
        t.string('postcode', 5);
    })
    .then(function(){

        return knex.schema.createTable('highway_types', function(t){

            t.integer('id')
                .primary()
                .index();
            t.string('type');
        });
    })
    .then(function(){

        return knex('highway_types')
        .insert([
            {id: 1, type: 'motorway'},
            {id: 2, type: 'primary'},
            {id: 3, type: 'secondary'},
            {id: 4, type: 'tertiary'},
            {id: 5, type: 'residential'}
        ]);
    })
    .then(function(){

        return knex.schema.createTable('ways', function(t){

            t.bigInteger('id')
                // .index();
            t.integer('version')
            t.string('name'); // tags.name
            t.integer('highway_type_id') //tags.highway
                // .references('id')
                // .inTable('highway_types');
            t.integer('max_speed'); //tags.maxspeed
        });
    })
    .then(function(){

        return knex.schema.createTable('nodes_to_ways', function(t){

            t.bigInteger('node_id');
            t.bigInteger('way_id');
        });
    });
};

exports.down = function(knex, Promise) {
  
    return Promise.resolve()
    .then(() => knex.schema.dropTable('nodes_to_ways'))
    .then(() => knex.schema.dropTable('ways'))
    .then(() => knex.schema.dropTable('highway_types'))
    .then(() => knex.schema.dropTable('nodes'));
};
