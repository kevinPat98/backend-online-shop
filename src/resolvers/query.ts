import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';
const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Lista de Usuarios Cargada Correctamente',
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            'Error al cargar los usuarios. Comprueba que tiene correctamente todo',
          users: [],
        };
      }
    },

    async login(_, { email, password }, { db }) {
      try {
        const user = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });

        if (user === null) {
          return {
            status: false,
            message: 'Usuario no existe',
            token: null,
          };
        }

       const passwordCheck = bcrypt.compareSync(password, user.password);

        if(passwordCheck !== null){
          delete user.password;
          delete user.birthday;
          delete user.registerDate;
        }  
        return {
          status: true,
          message:
            !passwordCheck
              ? 'Password y usuario no son correctos, sesión no iniciada'
              : 'Usuario cargado correctamente',
          token: 
          !passwordCheck
          ? null
          : new JWT().sign({ user }, EXPIRETIME.H24),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            'Error al cargar el ususario. Comprueba que tiene correctamente todo',
          token: null,
        };
      }
    },
    me(_,__, { token }){
      console.log(token);
      let info = new JWT().verify(token);
      if(info === MESSAGES.TOKEN_VERIFICATION_FAILED){
        return{
          status: false,
          message: info,
          user: null
        };
      }
      return{
        status: true,
        message: 'Usuario autenticado Correctamente mediante el token',
        user: Object.values(info)[0]
      };
    }
  },
};

export default resolversQuery;
