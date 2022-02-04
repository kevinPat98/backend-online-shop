import  query  from './query';
import { IResolvers } from 'graphql-tools';
import mutation from './mutation';
import type from './type';
const resolvers: IResolvers = {
    ...query,
    ...mutation,
    ...type
};

export default resolvers;