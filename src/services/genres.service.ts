import { asignDocumentId, findOneElement } from './../lib/db-operations';
import { COLLECTIONS } from './../config/constants';
import { IcontextData } from './../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.service';
import slugify from 'slugify';

class GenresService extends ResolversOperationsService{
    collection = COLLECTIONS.GENRES;
    constructor(root: object, variables: object, context: IcontextData){
        super(root, variables, context);
    }

    async items(){
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result= await this.list(this.collection, 'generos', page, itemsPage);
        return{info: result.info, status: result.status, message: result.message, genres: result.items };
    }
    async details(){
        const result= await this.get(this.collection);
        return{status: result.status, message: result.message, genre: result.item };
    }
    async insert(){
        const genre = this.getVariables().genre;
        //Comprobar que no está en blanco y no está indefinido
        if(!this.checkData(genre || '')){
            return {
                status: false,
                message: 'El genero no se ha especificado correctamente',
                genre: null
            };
        }
        //Comprobar que no existe
        if(await this.checkInDatabase(genre || '')){
            return {
                status: false,
                message: 'El genero existe en la base de datos, intente con otro genero',
                genre: null
            };
        }
        //Si están validadas las anteriores, crear el documento
        const genreObject = {
            id: await asignDocumentId(this.getDb(), this.collection, {id: -1}),
            name: genre,
            slug: slugify(genre || '',{lower: true})
        };
        const result= await this.add(this.collection, genreObject, 'genero');
        return{status: result.status, message: result.message, genre: result.item };
    }
    async modify(){
        const id = this.getVariables().id;
        const genre= this.getVariables().genre;
        // Comprobar que el ID es correcto
        if(!this.checkData(String(id)|| '')){
            return {
                status: false,
                message: 'El ID del genero no se ha especificado correctamente',
                genre: null
            };
        }
         //Comprobar que no existe
         if(!this.checkData(genre || '')){
            return {
                status: false,
                message: 'El genero no se ha especificado correctamente',
                genre: null
            };
        }
        const objectUpdate = { 
            name: genre, 
            slug: slugify(genre || '', {lower: true})
        };
        const result = await this.update(this.collection, {id} , objectUpdate, 'genero');
        return{status: result.status, message: result.message, genre: result.item };
    }
    async delete(){
        const id = this.getVariables().id;
        if(!this.checkData(String(id)|| '')){
            return {
                status: false,
                message: 'El ID del genero no se ha especificado correctamente',
                genre: null
            };
        }
        const result = await this.del(this.collection, {id}, 'genero');
        return{status: result.status, message: result.message };
    }
    async block(){
        const id = this.getVariables().id;
        if(!this.checkData(String(id)|| '')){
            return {
                status: false,
                message: 'El ID del genero no se ha especificado correctamente',
                genre: null
            };
        }
        const result = await this.update(this.collection, { id }, { active: false }, 'Género');
        return {
            status: result.status,
            message: (result.status) ? 'Bloqueado Correctamente': 'No se ha bloqueado'
        };
    }

    private checkData(value: string){
        return (value === '' || value === undefined) ? false:true;
    }

    private async checkInDatabase(value: string){
        return await findOneElement(this.getDb(), this.collection, {
            name: value
        });
    }
}

export default GenresService;