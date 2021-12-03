import { Db } from 'mongodb';

/**
 * Obtener el ID que se va a utilizar en el nuevo usuario
 * @param database base de datos con la que se está trabajando
 * @param collection Coleccion del ultimo elemento
 * @param sort Como se quiere ordenar { <propiedad>: -1}
 * @returns 
 */
export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();
  if (lastElement.length === 0) {
    return 1;
  }
  return lastElement[0].id + 1;
};

export const findOneElement = async (
    database: Db,
    collection:string,
    filter: object
) =>{
    return database
          .collection(collection)
          .findOne(filter);
};

export const insertOneElement = async (
    database: Db,
    collection: string,
    document: object
) => {
return await database.collection(collection).insertOne(document);
};

export const insertManyElements = async (
    database: Db,
    collection: string,
    documents: Array<object>
) => {
return await database.collection(collection).insertMany(documents);
};

export const findElements = async (
 database: Db,
 collection: string,
 filter: object ={}
)=>{
    return await database.collection(collection).find(filter).toArray();
};