import { Resolver, Query } from '@nestjs/graphql';
import { Author } from './author.model';

@Resolver(() => Author)
export class AuthorResolver {
  @Query(() => Author)
  async author() {
    return {
      id: 'id',
      firstName: 'firstName',
      lastName: 'lastName',
    };
  }
}
