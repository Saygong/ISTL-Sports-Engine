import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ISO8601Date: { input: any; output: any; }
  ISO8601DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ActionResult = {
  __typename?: 'ActionResult';
  result: ActionResultEnum;
};

export enum ActionResultEnum {
  Ko = 'ko',
  Ok = 'ok'
}

export type AuthDataArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
};

export type BookMatchArgs = {
  matchId: Scalars['ID']['input'];
};

export enum CompositionEnum {
  Double = 'double',
  Single = 'single'
}

export type Court = {
  __typename?: 'Court';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type CreateMatchResultArgs = {
  description: Scalars['String']['input'];
  matchId: Scalars['ID']['input'];
  teamId: Scalars['ID']['input'];
};

export type Field = {
  __typename?: 'Field';
  court: Court;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  matches: Array<Match>;
  maxSeats?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export enum GenderEnum {
  Female = 'female',
  Male = 'male'
}

export type Headers = {
  __typename?: 'Headers';
  accessToken: Scalars['String']['output'];
  authorization: Scalars['String']['output'];
  client: Scalars['String']['output'];
  expiry: Scalars['Int']['output'];
  tokenType: Scalars['String']['output'];
  uid: Scalars['String']['output'];
};

export type JoinTournamentArgs = {
  teamId?: InputMaybe<Scalars['ID']['input']>;
  tournamentId: Scalars['ID']['input'];
};

export type Match = {
  __typename?: 'Match';
  date: Scalars['ISO8601DateTime']['output'];
  field: Field;
  id: Scalars['ID']['output'];
  referee?: Maybe<Referee>;
  round: Scalars['Int']['output'];
  teams: Array<Team>;
  tournament: Tournament;
  viewers: Array<Player>;
  winner?: Maybe<Team>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bookMatch?: Maybe<Player>;
  createMatchResult?: Maybe<Referee>;
  createTournament?: Maybe<Organizer>;
  joinTournament?: Maybe<Player>;
  signIn?: Maybe<SignAction>;
  signOut?: Maybe<ActionResult>;
  signUp?: Maybe<SignAction>;
  unbookMatch?: Maybe<Player>;
};


export type MutationBookMatchArgs = {
  args: BookMatchArgs;
};


export type MutationCreateMatchResultArgs = {
  args: CreateMatchResultArgs;
};


export type MutationCreateTournamentArgs = {
  args: TournamentDataArgs;
};


export type MutationJoinTournamentArgs = {
  args: JoinTournamentArgs;
};


export type MutationSignInArgs = {
  args: SignInArgs;
};


export type MutationSignUpArgs = {
  args: SignUpArgs;
};


export type MutationUnbookMatchArgs = {
  args: UnbookMatchArgs;
};

export type Organizer = UserInterface & {
  __typename?: 'Organizer';
  birthdate: Scalars['ISO8601Date']['output'];
  data: Scalars['JSON']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: GenderEnum;
  id: Scalars['ID']['output'];
  lastName: Scalars['JSON']['output'];
  tournaments: Array<Tournament>;
};

export type Player = UserInterface & {
  __typename?: 'Player';
  birthdate: Scalars['ISO8601Date']['output'];
  bookedMatches: Array<Match>;
  data: Scalars['JSON']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: GenderEnum;
  id: Scalars['ID']['output'];
  joinableTeams: Array<Team>;
  joinableTournaments: Array<Tournament>;
  joinedTournaments: Array<Tournament>;
  lastName: Scalars['JSON']['output'];
  lostMatches: Array<Result>;
  matchesToPlay: Array<Match>;
  wonMatches: Array<Result>;
};


export type PlayerJoinableTeamsArgs = {
  tournamentId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  courtsAll: Array<Court>;
  match: Match;
  me: UserUnion;
  refereesAll: Array<Referee>;
  sportsAll: Array<Sport>;
  tournament: Tournament;
  tournamentsAll: Array<Tournament>;
};


export type QueryMatchArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTournamentsAllArgs = {
  search?: InputMaybe<TournamentSearchInput>;
};

export type Referee = UserInterface & {
  __typename?: 'Referee';
  birthdate: Scalars['ISO8601Date']['output'];
  data: Scalars['JSON']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: GenderEnum;
  id: Scalars['ID']['output'];
  lastName: Scalars['JSON']['output'];
  refereedTournaments: Array<Tournament>;
};

export type Result = {
  __typename?: 'Result';
  id: Scalars['ID']['output'];
};

export type SignAction = {
  __typename?: 'SignAction';
  headers: Headers;
  user: UserUnion;
};

export type SignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpArgs = {
  auth: AuthDataArgs;
  user: UserDataArgs;
};

export type Sport = {
  __typename?: 'Sport';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  variantKind: VariantKindEnum;
};

export type Team = {
  __typename?: 'Team';
  composition: CompositionEnum;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  players: Array<Player>;
};

export type Tournament = {
  __typename?: 'Tournament';
  composition: CompositionEnum;
  court: Court;
  gender: GenderEnum;
  id: Scalars['ID']['output'];
  matches: Array<Match>;
  maxAge: Scalars['Int']['output'];
  minAge: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  numberOfMatches: Scalars['Int']['output'];
  organizer: Organizer;
  sport: Sport;
  startDate: Scalars['ISO8601Date']['output'];
};

export type TournamentDataArgs = {
  composition: CompositionEnum;
  court: Scalars['ID']['input'];
  gender: GenderEnum;
  maxAge: Scalars['Int']['input'];
  minAge: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  numberOfMatches: Scalars['Int']['input'];
  referees: Array<Scalars['ID']['input']>;
  sport: Scalars['ID']['input'];
  startDate: Scalars['ISO8601Date']['input'];
};

export type TournamentSearchInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  sportId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['ISO8601Date']['input']>;
};

export type UnbookMatchArgs = {
  matchId: Scalars['ID']['input'];
};

export type UserDataArgs = {
  birthdate: Scalars['ISO8601Date']['input'];
  firstName: Scalars['String']['input'];
  gender: GenderEnum;
  lastName: Scalars['String']['input'];
};

export type UserInterface = {
  birthdate: Scalars['ISO8601Date']['output'];
  data: Scalars['JSON']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: GenderEnum;
  id: Scalars['ID']['output'];
  lastName: Scalars['JSON']['output'];
};

export type UserUnion = Organizer | Player | Referee;

export enum VariantKindEnum {
  PingPong = 'ping_pong',
  Tennis = 'tennis'
}

export type AuthHeadersFragment = { __typename: 'Headers', accessToken: string, uid: string, client: string, expiry: number, authorization: string, tokenType: string };

export type SportFragment = { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum };

export type TournamentFragment = { __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum } };

export type SignInMutationVariables = Exact<{
  input: SignInArgs;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignAction', headers: { __typename: 'Headers', accessToken: string, uid: string, client: string, expiry: number, authorization: string, tokenType: string }, user:
      | { __typename: 'Organizer', id: string, firstName: string, lastName: any }
      | { __typename: 'Player', id: string, firstName: string, lastName: any }
      | { __typename: 'Referee', id: string, firstName: string, lastName: any }
     } | null };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: { __typename?: 'ActionResult', result: ActionResultEnum } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me:
    | { __typename: 'Organizer', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any }
    | { __typename: 'Player', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any }
    | { __typename: 'Referee', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any }
   };

export type SportsQueryVariables = Exact<{ [key: string]: never; }>;


export type SportsQuery = { __typename?: 'Query', sportsAll: Array<{ __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }> };

export type TournamentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TournamentQuery = { __typename?: 'Query', tournament: { __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum } } };

export type TournamentsAllQueryVariables = Exact<{
  search?: InputMaybe<TournamentSearchInput>;
}>;


export type TournamentsAllQuery = { __typename?: 'Query', tournamentsAll: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum } }> };

export const AuthHeadersFragmentDoc = gql`
    fragment AuthHeaders on Headers {
  accessToken
  uid
  client
  expiry
  authorization
  tokenType
  __typename
}
    `;
export const SportFragmentDoc = gql`
    fragment Sport on Sport {
  id
  description
  variantKind
  __typename
}
    `;
export const TournamentFragmentDoc = gql`
    fragment Tournament on Tournament {
  id
  name
  composition
  court {
    name
  }
  gender
  maxAge
  minAge
  numberOfMatches
  organizer {
    ... on Organizer {
      id
      firstName
      lastName
    }
  }
  sport {
    ...Sport
  }
  startDate
  __typename
}
    ${SportFragmentDoc}`;
export const SignInDocument = gql`
    mutation SignIn($input: SignInArgs!) {
  signIn(args: $input) {
    headers {
      ...AuthHeaders
    }
    user {
      ... on Organizer {
        id
        firstName
        lastName
        __typename
      }
      ... on Player {
        id
        firstName
        lastName
        __typename
      }
      ... on Referee {
        id
        firstName
        lastName
        __typename
      }
    }
  }
}
    ${AuthHeadersFragmentDoc}`;

export function useSignInMutation() {
  return Urql.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);
};
export const SignOutDocument = gql`
    mutation SignOut {
  signOut {
    result
  }
}
    `;

export function useSignOutMutation() {
  return Urql.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ... on Organizer {
      id
      firstName
      lastName
      gender
      birthdate
      __typename
    }
    ... on Player {
      id
      firstName
      lastName
      gender
      birthdate
      __typename
    }
    ... on Referee {
      id
      firstName
      lastName
      gender
      birthdate
      __typename
    }
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const SportsDocument = gql`
    query Sports {
  sportsAll {
    ...Sport
  }
}
    ${SportFragmentDoc}`;

export function useSportsQuery(options?: Omit<Urql.UseQueryArgs<SportsQueryVariables>, 'query'>) {
  return Urql.useQuery<SportsQuery, SportsQueryVariables>({ query: SportsDocument, ...options });
};
export const TournamentDocument = gql`
    query Tournament($id: ID!) {
  tournament(id: $id) {
    ...Tournament
  }
}
    ${TournamentFragmentDoc}`;

export function useTournamentQuery(options: Omit<Urql.UseQueryArgs<TournamentQueryVariables>, 'query'>) {
  return Urql.useQuery<TournamentQuery, TournamentQueryVariables>({ query: TournamentDocument, ...options });
};
export const TournamentsAllDocument = gql`
    query TournamentsAll($search: TournamentSearchInput) {
  tournamentsAll(search: $search) {
    ...Tournament
  }
}
    ${TournamentFragmentDoc}`;

export function useTournamentsAllQuery(options?: Omit<Urql.UseQueryArgs<TournamentsAllQueryVariables>, 'query'>) {
  return Urql.useQuery<TournamentsAllQuery, TournamentsAllQueryVariables>({ query: TournamentsAllDocument, ...options });
};