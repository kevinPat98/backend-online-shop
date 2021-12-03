import { findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { asignDocumentId } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      //Comprobar que el usuario no existe
      const userCheck = await findOneElement(db,COLLECTIONS.USERS,{ email: user.email });
      if (userCheck != null) {
        return {
            status: false,
            message: `El email ${user.email} está registrado y no se puede registrar con este email`,
            user: null
        };
      }
      // Comprobar el último usuario registrado para asignar ID
     user.id = await asignDocumentId(db, COLLECTIONS.USERS, {registerDate: -1});
      // Asignar la fecha en formato ISO en la propiedad resgisterDate
      user.registerDate = new Date().toISOString();
      //Encriptar Password
      user.password = bcrypt.hashSync(user.password, 10);
      //Guardar el documento (registro) en la colección
      return await insertOneElement(db,COLLECTIONS.USERS,user)
        .then(async () => {
            return {
                status: true,
                message: `El usuario con el email ${user.email} está registrado correctamente`,
                user
            };  
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Error inesperado, prueba de nuevo`,
            user: null
        };
        });
    },
  },
};

export default resolversUserMutation;