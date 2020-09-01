/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { core } from "@nexus/schema"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "Date";
    datetime<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    datetime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  DateTime: any
}

export interface NexusGenRootTypes {
  Leaderboard: { // root type
    country: string; // String!
    drops: number; // Int!
    games: number; // Int!
    leaderboard_id: number; // Int!
    name: string; // String!
    profile_id: number; // Int!
    rating: number; // Int!
  }
  Match: { // root type
    leaderboard_id: number; // Int!
    match_id: string; // String!
    name: string; // String!
  }
  Mutation: {};
  Player: { // root type
    match_id: string; // String!
    name: string; // String!
    profile_id: number; // Int!
    rating?: number | null; // Int
  }
  Profile: { // root type
    name: string; // String!
    profile_id: number; // Int!
  }
  Query: {};
  RatingHistory: { // root type
    history: NexusGenRootTypes['RatingHistoryEntry'][]; // [RatingHistoryEntry!]!
    leaderboard_id: number; // Int!
    profile_id: number; // Int!
  }
  RatingHistoryEntry: { // root type
    drops: number; // Int!
    num_losses: number; // Int!
    num_wins: number; // Int!
    rating: number; // Int!
    streak: number; // Int!
  }
  Stats: { // root type
    allies: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    civ: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    leaderboard_id: number; // Int!
    map_type: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    opponents: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
  }
  StatsEntry: { // root type
    civ?: number | null; // Int
    country?: string | null; // String
    games: number; // Int!
    map_type?: number | null; // Int
    name?: string | null; // String
    wins: number; // Int!
  }
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  String: NexusGenScalars['String'];
  Int: NexusGenScalars['Int'];
  Float: NexusGenScalars['Float'];
  Boolean: NexusGenScalars['Boolean'];
  ID: NexusGenScalars['ID'];
  Date: NexusGenScalars['Date'];
  DateTime: NexusGenScalars['DateTime'];
}

export interface NexusGenFieldTypes {
  Leaderboard: { // field return type
    country: string; // String!
    drops: number; // Int!
    games: number; // Int!
    leaderboard_id: number; // Int!
    name: string; // String!
    profile_id: number; // Int!
    rating: number; // Int!
  }
  Match: { // field return type
    finished: NexusGenScalars['DateTime'] | null; // DateTime
    leaderboard_id: number; // Int!
    match_id: string; // String!
    name: string; // String!
    players: NexusGenRootTypes['Player'][]; // [Player!]!
    started: NexusGenScalars['DateTime']; // DateTime!
  }
  Mutation: { // field return type
    publish: number | null; // Int
  }
  Player: { // field return type
    match: NexusGenRootTypes['Match']; // Match!
    match_id: string; // String!
    name: string; // String!
    profile_id: number; // Int!
    rating: number | null; // Int
  }
  Profile: { // field return type
    drops: number | null; // Int
    games: number | null; // Int
    leaderboards: NexusGenRootTypes['Leaderboard'][]; // [Leaderboard!]!
    name: string; // String!
    profile_id: number; // Int!
    rating_history: NexusGenRootTypes['RatingHistory'][]; // [RatingHistory!]!
    stats: NexusGenRootTypes['Stats'][]; // [Stats!]!
  }
  Query: { // field return type
    match: NexusGenRootTypes['Match']; // Match!
    matches: NexusGenRootTypes['Match'][]; // [Match!]!
    profile: NexusGenRootTypes['Profile']; // Profile!
    temp: NexusGenRootTypes['Match'][]; // [Match!]!
    temp2: NexusGenRootTypes['Match'][]; // [Match!]!
  }
  RatingHistory: { // field return type
    history: NexusGenRootTypes['RatingHistoryEntry'][]; // [RatingHistoryEntry!]!
    leaderboard_id: number; // Int!
    profile_id: number; // Int!
  }
  RatingHistoryEntry: { // field return type
    drops: number; // Int!
    num_losses: number; // Int!
    num_wins: number; // Int!
    rating: number; // Int!
    streak: number; // Int!
    timestamp: NexusGenScalars['DateTime']; // DateTime!
  }
  Stats: { // field return type
    allies: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    civ: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    leaderboard_id: number; // Int!
    map_type: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
    opponents: NexusGenRootTypes['StatsEntry'][]; // [StatsEntry!]!
  }
  StatsEntry: { // field return type
    civ: number | null; // Int
    country: string | null; // String
    games: number; // Int!
    map_type: number | null; // Int
    name: string | null; // String
    wins: number; // Int!
  }
}

export interface NexusGenArgTypes {
  Query: {
    match: { // args
      matchId: string; // String!
    }
    matches: { // args
      count: number; // Int!
      leaderboard_id?: number | null; // Int
      profile_id?: number | null; // Int
      start: number; // Int!
    }
    profile: { // args
      profile_id?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Leaderboard" | "Match" | "Mutation" | "Player" | "Profile" | "Query" | "RatingHistory" | "RatingHistoryEntry" | "Stats" | "StatsEntry";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Date" | "DateTime" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}