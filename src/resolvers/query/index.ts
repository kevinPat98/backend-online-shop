import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversShopProductQuery from './shop-product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopProductQuery,
    resolversGenreQuery,
    resolversTagQuery
]);

export default queryResolvers;