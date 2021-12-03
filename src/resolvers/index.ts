import  query  from './query';
import { IResolvers } from 'graphql-tools';
import mutation from './mutation';

const resolvers: IResolvers = {
    ...query,
    ...mutation
};

export default resolvers;