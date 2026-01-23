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
  matchResult?: Maybe<Result>;
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
  description?: Maybe<Scalars['String']['output']>;
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
  joinedBySomeone: Array<Team>;
  matches: Array<Match>;
  maxAge: Scalars['Int']['output'];
  minAge: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  numberOfMatches: Scalars['Int']['output'];
  organizer: Organizer;
  sport: Sport;
  startDate: Scalars['ISO8601Date']['output'];
  teams: Array<Team>;
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

export type MatchFragment = { __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> };

export type SportFragment = { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum };

export type TeamFragment = { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> };

export type TournamentFragment = { __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> };

export type BookMatchMutationVariables = Exact<{
  args: BookMatchArgs;
}>;


export type BookMatchMutation = { __typename?: 'Mutation', bookMatch?: { __typename?: 'Player', id: string } | null };

export type CreateMatchResultMutationVariables = Exact<{
  args: CreateMatchResultArgs;
}>;


export type CreateMatchResultMutation = { __typename?: 'Mutation', createMatchResult?: { __typename?: 'Referee', id: string } | null };

export type CreateTournamentMutationVariables = Exact<{
  args: TournamentDataArgs;
}>;


export type CreateTournamentMutation = { __typename?: 'Mutation', createTournament?: { __typename?: 'Organizer', id: string } | null };

export type JoinTournamentMutationVariables = Exact<{
  args: JoinTournamentArgs;
}>;


export type JoinTournamentMutation = { __typename?: 'Mutation', joinTournament?: { __typename?: 'Player', id: string } | null };

export type SignInMutationVariables = Exact<{
  input: SignInArgs;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignAction', headers: { __typename: 'Headers', accessToken: string, uid: string, client: string, expiry: number, authorization: string, tokenType: string }, user:
      | { __typename: 'Organizer', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
      | { __typename: 'Player', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
      | { __typename: 'Referee', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
     } | null };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: { __typename?: 'ActionResult', result: ActionResultEnum } | null };

export type SignUpMutationVariables = Exact<{
  args: SignUpArgs;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'SignAction', headers: { __typename: 'Headers', accessToken: string, uid: string, client: string, expiry: number, authorization: string, tokenType: string }, user:
      | { __typename: 'Organizer', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
      | { __typename: 'Player', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
      | { __typename: 'Referee', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
     } | null };

export type UnbookMatchMutationVariables = Exact<{
  args: UnbookMatchArgs;
}>;


export type UnbookMatchMutation = { __typename?: 'Mutation', unbookMatch?: { __typename?: 'Player', id: string } | null };

export type CourtsAllQueryVariables = Exact<{ [key: string]: never; }>;


export type CourtsAllQuery = { __typename?: 'Query', courtsAll: Array<{ __typename?: 'Court', id: string, name?: string | null }> };

export type JoinableTeamsQueryVariables = Exact<{
  tournamentId: Scalars['ID']['input'];
}>;


export type JoinableTeamsQuery = { __typename?: 'Query', me:
    | { __typename?: 'Organizer' }
    | { __typename?: 'Player', id: string, joinableTeams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }
    | { __typename?: 'Referee' }
   };

export type MatchQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MatchQuery = { __typename?: 'Query', match: { __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me:
    | { __typename: 'Organizer', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string }
    | { __typename: 'Player', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string, joinedTournaments: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }>, joinableTournaments: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }>, bookedMatches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, matchesToPlay: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, lostMatches: Array<{ __typename?: 'Result', id: string }>, wonMatches: Array<{ __typename?: 'Result', id: string }> }
    | { __typename: 'Referee', id: string, firstName: string, lastName: any, gender: GenderEnum, birthdate: any, email: string, refereedTournaments: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }> }
   };

export type RefereedTournamentsQueryVariables = Exact<{ [key: string]: never; }>;


export type RefereedTournamentsQuery = { __typename?: 'Query', me:
    | { __typename?: 'Organizer' }
    | { __typename?: 'Player' }
    | { __typename?: 'Referee', id: string, refereedTournaments: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }> }
   };

export type RefereesAllQueryVariables = Exact<{ [key: string]: never; }>;


export type RefereesAllQuery = { __typename?: 'Query', refereesAll: Array<{ __typename: 'Referee', id: string, firstName: string, lastName: any }> };

export type SportsQueryVariables = Exact<{ [key: string]: never; }>;


export type SportsQuery = { __typename?: 'Query', sportsAll: Array<{ __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }> };

export type TournamentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type TournamentQuery = { __typename?: 'Query', tournament: { __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> } };

export type TournamentsAllQueryVariables = Exact<{
  search?: InputMaybe<TournamentSearchInput>;
}>;


export type TournamentsAllQuery = { __typename?: 'Query', tournamentsAll: Array<{ __typename: 'Tournament', id: string, name?: string | null, composition: CompositionEnum, gender: GenderEnum, maxAge: number, minAge: number, numberOfMatches: number, startDate: any, court: { __typename?: 'Court', name?: string | null }, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, matches: Array<{ __typename: 'Match', date: any, id: string, round: number, field: { __typename?: 'Field', id: string, maxSeats?: number | null }, matchResult?: { __typename?: 'Result', description?: string | null } | null, referee?: { __typename?: 'Referee', id: string, firstName: string, lastName: any } | null, teams: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }>, tournament: { __typename?: 'Tournament', id: string, name?: string | null, organizer: { __typename?: 'Organizer', id: string, firstName: string, lastName: any }, sport: { __typename?: 'Sport', id: string, description?: string | null, variantKind: VariantKindEnum }, court: { __typename?: 'Court', id: string, name?: string | null } }, winner?: { __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> } | null, viewers: Array<{ __typename?: 'Player', id: string }> }>, joinedBySomeone: Array<{ __typename: 'Team', composition: CompositionEnum, id: string, name?: string | null, players: Array<{ __typename?: 'Player', id: string, firstName: string, lastName: any }> }> }> };

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
export const TeamFragmentDoc = gql`
    fragment Team on Team {
  composition
  id
  name
  players {
    ... on Player {
      id
      firstName
      lastName
    }
  }
  __typename
}
    `;
export const MatchFragmentDoc = gql`
    fragment Match on Match {
  date
  field {
    id
    maxSeats
  }
  id
  matchResult {
    description
  }
  referee {
    ... on Referee {
      id
      firstName
      lastName
    }
  }
  round
  teams {
    ...Team
  }
  tournament {
    id
    name
    organizer {
      ... on Organizer {
        id
        firstName
        lastName
      }
    }
    sport {
      id
      description
      variantKind
    }
    court {
      id
      name
    }
  }
  winner {
    ...Team
  }
  viewers {
    ... on Player {
      id
    }
  }
  __typename
}
    ${TeamFragmentDoc}`;
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
  matches {
    ...Match
  }
  joinedBySomeone {
    ...Team
  }
  __typename
}
    ${SportFragmentDoc}
${MatchFragmentDoc}
${TeamFragmentDoc}`;
export const BookMatchDocument = gql`
    mutation BookMatch($args: BookMatchArgs!) {
  bookMatch(args: $args) {
    ... on Player {
      id
    }
  }
}
    `;

export function useBookMatchMutation() {
  return Urql.useMutation<BookMatchMutation, BookMatchMutationVariables>(BookMatchDocument);
};
export const CreateMatchResultDocument = gql`
    mutation CreateMatchResult($args: CreateMatchResultArgs!) {
  createMatchResult(args: $args) {
    ... on Referee {
      id
    }
  }
}
    `;

export function useCreateMatchResultMutation() {
  return Urql.useMutation<CreateMatchResultMutation, CreateMatchResultMutationVariables>(CreateMatchResultDocument);
};
export const CreateTournamentDocument = gql`
    mutation CreateTournament($args: TournamentDataArgs!) {
  createTournament(args: $args) {
    ... on Organizer {
      id
    }
  }
}
    `;

export function useCreateTournamentMutation() {
  return Urql.useMutation<CreateTournamentMutation, CreateTournamentMutationVariables>(CreateTournamentDocument);
};
export const JoinTournamentDocument = gql`
    mutation JoinTournament($args: JoinTournamentArgs!) {
  joinTournament(args: $args) {
    ... on Player {
      id
    }
  }
}
    `;

export function useJoinTournamentMutation() {
  return Urql.useMutation<JoinTournamentMutation, JoinTournamentMutationVariables>(JoinTournamentDocument);
};
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
        gender
        birthdate
        email
        __typename
      }
      ... on Player {
        id
        firstName
        lastName
        gender
        birthdate
        email
        __typename
      }
      ... on Referee {
        id
        firstName
        lastName
        gender
        birthdate
        email
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
export const SignUpDocument = gql`
    mutation SignUp($args: SignUpArgs!) {
  signUp(args: $args) {
    headers {
      ...AuthHeaders
    }
    user {
      ... on Organizer {
        id
        firstName
        lastName
        gender
        birthdate
        email
        __typename
      }
      ... on Player {
        id
        firstName
        lastName
        gender
        birthdate
        email
        __typename
      }
      ... on Referee {
        id
        firstName
        lastName
        gender
        birthdate
        email
        __typename
      }
    }
  }
}
    ${AuthHeadersFragmentDoc}`;

export function useSignUpMutation() {
  return Urql.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);
};
export const UnbookMatchDocument = gql`
    mutation UnbookMatch($args: UnbookMatchArgs!) {
  unbookMatch(args: $args) {
    ... on Player {
      id
    }
  }
}
    `;

export function useUnbookMatchMutation() {
  return Urql.useMutation<UnbookMatchMutation, UnbookMatchMutationVariables>(UnbookMatchDocument);
};
export const CourtsAllDocument = gql`
    query CourtsAll {
  courtsAll {
    id
    name
  }
}
    `;

export function useCourtsAllQuery(options?: Omit<Urql.UseQueryArgs<CourtsAllQueryVariables>, 'query'>) {
  return Urql.useQuery<CourtsAllQuery, CourtsAllQueryVariables>({ query: CourtsAllDocument, ...options });
};
export const JoinableTeamsDocument = gql`
    query JoinableTeams($tournamentId: ID!) {
  me {
    ... on Player {
      id
      joinableTeams(tournamentId: $tournamentId) {
        ...Team
      }
    }
  }
}
    ${TeamFragmentDoc}`;

export function useJoinableTeamsQuery(options: Omit<Urql.UseQueryArgs<JoinableTeamsQueryVariables>, 'query'>) {
  return Urql.useQuery<JoinableTeamsQuery, JoinableTeamsQueryVariables>({ query: JoinableTeamsDocument, ...options });
};
export const MatchDocument = gql`
    query Match($id: ID!) {
  match(id: $id) {
    ...Match
  }
}
    ${MatchFragmentDoc}`;

export function useMatchQuery(options: Omit<Urql.UseQueryArgs<MatchQueryVariables>, 'query'>) {
  return Urql.useQuery<MatchQuery, MatchQueryVariables>({ query: MatchDocument, ...options });
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
      email
      __typename
    }
    ... on Player {
      id
      firstName
      lastName
      gender
      birthdate
      email
      joinedTournaments {
        ...Tournament
      }
      joinableTournaments {
        ...Tournament
      }
      bookedMatches {
        ...Match
      }
      matchesToPlay {
        ...Match
      }
      lostMatches {
        id
      }
      wonMatches {
        id
      }
      __typename
    }
    ... on Referee {
      id
      firstName
      lastName
      gender
      birthdate
      email
      refereedTournaments {
        ...Tournament
      }
      __typename
    }
  }
}
    ${TournamentFragmentDoc}
${MatchFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const RefereedTournamentsDocument = gql`
    query RefereedTournaments {
  me {
    ... on Referee {
      id
      refereedTournaments {
        ...Tournament
      }
    }
  }
}
    ${TournamentFragmentDoc}`;

export function useRefereedTournamentsQuery(options?: Omit<Urql.UseQueryArgs<RefereedTournamentsQueryVariables>, 'query'>) {
  return Urql.useQuery<RefereedTournamentsQuery, RefereedTournamentsQueryVariables>({ query: RefereedTournamentsDocument, ...options });
};
export const RefereesAllDocument = gql`
    query RefereesAll {
  refereesAll {
    ... on Referee {
      id
      firstName
      lastName
      __typename
    }
  }
}
    `;

export function useRefereesAllQuery(options?: Omit<Urql.UseQueryArgs<RefereesAllQueryVariables>, 'query'>) {
  return Urql.useQuery<RefereesAllQuery, RefereesAllQueryVariables>({ query: RefereesAllDocument, ...options });
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