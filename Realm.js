const Numbers = {
    name: 'Numbers',
    primaryKey: 'id',
    properties: {
        id: 'string',
        number:  'string',
        sent: {type: 'bool?', default: false}
    }
};

const databaseOptions = {
  path: 'realm1.realm',
  schema: [Numbers],
  schemaVersion: 1,
  //migration: (oldRealm, newRealm) => {
  //  // only apply this change if upgrading to schemaVersion 1
  //  if (oldRealm.schemaVersion < 2) {
  //    const oldObjects = oldRealm.objects('user_playas');
  //    const newObjects = newRealm.objects('user_playas');
  //    // loop through all objects and set the name property in the new schema
  //    for (let i = 0; i < oldObjects.length; i++) {
  //      newObjects[i].id = oldObjects[i].id
  //      newObjects[i].municipio_id = oldObjects[i].municipio_id
  //      newObjects[i].nombre = oldObjects[i].nombre
  //      newObjects[i].coordenadas = oldObjects[i].coordenadas
  //      newObjects[i].tamanio = oldObjects[i].tamanio
  //      newObjects[i].activo = oldObjects[i].activo
  //      newObjects[i].created = oldObjects[i].created
  //      newObjects[i].modified = oldObjects[i].modified
  //    }
  //  }
  //}
}

export {
    databaseOptions
}