import { IResolvers } from 'graphql-tools';
import { pagination } from '../../lib/pagination';
import GenresService from '../../services/genres.service';

const resolversGenreQuery: IResolvers = {
    Query:{
        async genres(_, variables, { db }){
          return new GenresService(_,{
              pagination: variables
          },{ db }).items();
        },
        async genre(_, { id }, { db }){
            return new GenresService(_,{ id },{ db }).details();
        }
    }
}; 

export default resolversGenreQuery;