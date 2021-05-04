import { ObjectId } from "bson";

export enum Collections {
  Rooms = "rooms",
  Estimates = "estimates",
}

export type room = {
  _id: ObjectId;
  _partitionKey: string;
  topic: string;
  userId: ObjectId;
};

export const roomSchema = {
  name: "room",
  properties: {
    _id: "objectId?",
    _partitionKey: "string",
    topic: "string?",
    userId: "objectId",
  },
  primaryKey: "_id",
};

export type estimate = {
  _id: ObjectId;
  _partitionKey: string;
  estimate: number;
  name: string;
  roomId?: room;
  userId: ObjectId;
};
export const estimateSchema = {
  name: "estimate",
  properties: {
    _id: "objectId?",
    _partitionKey: "string",
    estimate: "int?",
    name: "string?",
    roomId: "room",
    userId: "objectId",
  },
  primaryKey: "_id",
};
