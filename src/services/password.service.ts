import { COLLECTIONS, EXPIRETIME } from '../config/constants';
import { findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import { IcontextData } from './../interfaces/context-data.interface';
import MailService from './mail.service';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';

class PasswordService extends ResolversOperationsService{
    constructor(root: object, variables: object, context: IcontextData){
        super(root, variables , context);
    }
    async sendMail(){
        const email = this.getVariables().user?.email || '';
        if (email === undefined || email === ''){
            return {
              status: false,
              message: 'Email no definido correctamente'
            };
        }
        // Coger la información del usuario
      const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, { email });
     
      // Si es el usuario es indefinido, enviar mensaje
      if (user === undefined || user === null) {
        return {
          status: false,
          message: `Usuario con el email ${email} no existe`,
        };
      }
      const newUser = {
        id: user.id,
        email,
      };
      const token = new JWT().sign({ user: newUser }, EXPIRETIME.M15);
      const html = `Para cambiar de contraseña ingrese a este link: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click Aquí</a>`;
      const mail = {
        to: email,
        subject: 'Solicitud para cambiar de contraseña',
        html
      };
      return new MailService().send(mail);
    }
    async change(){
      const id = this.getVariables().user?.id;
      let password = this.getVariables().user?.password;
      // Comprobar el id correcto: no indefinido y no en blanco
      if (id === undefined || id === ''){
        return {
          status: false,
          message: 'El Id necesita información correcta'
        };
      }
      // Comprobar el password correcto: no indefinido y no en blanco
      if (password === undefined || password === '' || password === '1234'){
        return {
          status: false,
          message: 'El password necesita información correcta'
        };
      }
      // Encriptar el password
      password = bcrypt.hashSync(password, 10);

      // Actualizar en el id seleccionado de la colección usuarios
      const result = await this.update(
        COLLECTIONS.USERS,
        { id },
        { password },
        'users'
      );
      return {
        status: result.status,
        message: (result.status) ? 'Contraseña cambiada correctamente' :
                                    result.message
      };
    }
}

export default PasswordService;