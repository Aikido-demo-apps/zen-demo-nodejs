import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Author, CreateAuthorInput } from './author.model';

@Resolver(() => Author)
export class AuthorResolver {
  @Query(() => Author)
  async author() {
    return {
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
    };
  }

  @Mutation(() => Author)
  async createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return createAuthorInput;
  }
}
