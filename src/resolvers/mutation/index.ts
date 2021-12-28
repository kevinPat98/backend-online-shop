import GMR from 'graphql-merge-resolvers';
import resolversGenreMutation from './genre';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMutation
]);

export default mutationResolvers;