// npm install --save neo4j-driver
// node example.js
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
  'bolt://34.227.161.76:7687',
  neo4j.auth.basic('neo4j', 'cubes-wars-subprogram'),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);

const query = `
  MATCH (n)
  RETURN COUNT(n) AS count
  `;

const session = driver.session({ database: 'neo4j' });

const getAllObjects = async () => {
  const result = await session.run(`MATCH (n) return n`);
  console.log(result.records.map((r) => r.toObject().n));
};

const getAllRelationships = async (kind = '') => {
  const relationshipType = kind.length > 0 ? `:${kind}` : '';
  const result = await session.run(
    `MATCH ()-[r${relationshipType}]-() return r`
  );
  console.log(result.records.map((r) => r.toObject()));
};

const getFilteredNodes = async (
  property = ['key', 'value'],
  showRelationships = false,
  showOnlyProperties = false
) => {
  if (typeof property[1] === 'string') {
    property[1] = `'${property[1]}'`;
  }

  const queryRelationship = showRelationships ? `-[r]-()` : '';

  const result = await session.run(
    `MATCH (n {${property[0]}: ${property[1]}})${queryRelationship} return n` +
      (showRelationships ? ',r' : '')
  );

  console.log(
    result.records.map((rec) => {
      if (showOnlyProperties && !showRelationships) {
        return rec.toObject().n.properties;
      } else {
        return rec.toObject();
      }
    })
  );
};

const getRelationshipsByTypes = async (type1 = '', type2 = '') => {
  const filter_1 = type1.length === 0 ? '' : `()-[r1:${type1}]-`;
  const filter_2 = type2.length === 0 ? '' : `-[r2:${type2}]-()`;

  const result = await session.run(`MATCH ${filter_1}(n)${filter_2} return n`);
  console.log(result.records.map((r) => r.toObject().n));
};

const getAllObjectSonsByName = async (name = '') => {
  const result = await session.run(
    `MATCH (n)-[s: SON]-(p {name: '${name}'}) return n`
  );

  console.log(result.records.map((r) => r.toObject().n));
};

const execQueries = async () => {
  //   await getAllObjects();
  //   await getAllRelationships();
  //   await getAllRelationships('PET');
  //   await getFilteredNodes(['hasTail', true], false);
  //   await getFilteredNodes(['name', 'Nikita'], true);
  //   await getFilteredNodes(['age', 27], false, true);
  //   await getRelationshipsByTypes('PET', 'WIFE');
  await getAllObjectSonsByName('Andrey');

  session.close();
  driver.close();
};

execQueries();
