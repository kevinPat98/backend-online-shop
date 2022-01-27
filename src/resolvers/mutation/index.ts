import GMR from 'graphql-merge-resolvers';
import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversMailMutation
]);

export default mutationResolvers;