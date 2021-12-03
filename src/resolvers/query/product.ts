import { IResolvers } from 'graphql-tools';
const resolversProductQuery: IResolvers = {
  Query: {
    products(){
      return false;
    }
  },
};

export default resolversProductQuery;
