import {Db} from 'mongodb';

export interface IcontextData{
    db?: Db;
    token?: string;
}