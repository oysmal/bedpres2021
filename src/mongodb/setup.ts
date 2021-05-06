import { useEffect, useMemo, useReducer, useState } from "react";
import { App, Credentials, User } from "realm-web";
import { Collections, estimate, room } from "./types";
import { ObjectID, ObjectId } from "bson";

const PUBLIC_PARTITION = "PUBLIC";

const app = new App({ id: "bedpres2021-bmkhz" });
const credentials = Credentials.anonymous();

let user: User | null = null;

async function setup(): Promise<Realm.User | null> {
  try {
    user = await app.logIn(credentials);
  } catch (err) {
    console.error("Failed to log in", err);
  }

  return user;
}

export function useMongoDB() {
  const [mongo, setMongo] = useState<Realm.Services.MongoDB | null>(null);

  useEffect(() => {
    setup().then(() => {
      setMongo(app?.currentUser?.mongoClient("mongodb-atlas") ?? null);
    });
  }, []);

  return mongo;
}

export function useCollection(collectionName: Collections) {
  const mongo = useMongoDB();
  return useMemo(
    () =>
      mongo?.db("bedpres2021").collection(collectionName.toString()) ?? null,
    [collectionName, mongo]
  );
}

function getMongoClient() {
  return app?.currentUser?.mongoClient("mongodb-atlas") ?? null;
}

export function getRooms(): Promise<room[]> {
  const mongo = getMongoClient();
  if (mongo) {
    return mongo
      .db("bedpres2021")
      .collection(Collections.Rooms.toString())
      .find({}, { sort: { _id: -1 } });
  } else {
    return setup().then(() =>
      getMongoClient()!
        .db("bedpres2021")
        .collection(Collections.Rooms.toString())
        .find({})
    );
  }
}

export function insertRoom(topic: string) {
  const mongo = getMongoClient();
  if (mongo) {
    return mongo
      .db("bedpres2021")
      .collection(Collections.Rooms.toString())
      .insertOne({
        topic,
        userId: new ObjectId(app?.currentUser?.id),
        _partitionKey: PUBLIC_PARTITION,
      } as Partial<room>);
  } else {
    setup().then(() =>
      getMongoClient()!
        .db("bedpres2021")
        .collection(Collections.Rooms.toString())
        .insertOne({
          topic,
          userId: new ObjectId(app?.currentUser?.id),
          _partitionKey: PUBLIC_PARTITION,
        } as Partial<room>)
    );
  }
}

export function useRoom(id: string) {
  const shouldRefresh = useRefresh(Collections.Estimates, {
    roomId: new ObjectId(id),
  });
  const [roomAndEstimates, setRoomAndEstimates] = useState<{
    room: room | null;
    estimates: estimate[];
  }>({ room: null, estimates: [] });
  const roomsCollection = useCollection(Collections.Rooms);
  const estimatesCollection = useCollection(Collections.Estimates);

  useEffect(() => {
    roomsCollection?.findOne({ _id: new ObjectId(id) }).then((room) => {
      estimatesCollection?.find({ roomId: room._id }).then((estimates) => {
        setRoomAndEstimates({ room, estimates });
      });
    });
  }, [roomsCollection, estimatesCollection, id, shouldRefresh]);

  return roomAndEstimates;
}

export function useUpsertEstimate() {
  const [estimateId, setEstimateId] = useState<ObjectID | null>(null);
  const collection = useCollection(Collections.Estimates);

  return (room: room, name: string, estimate: number) => {
    if (estimateId) {
      return collection?.updateOne(
        { _id: estimateId },
        {
          roomId: room._id,
          estimate,
          userId: new ObjectId(app?.currentUser?.id),
          name,
          _partitionKey: PUBLIC_PARTITION,
        }
      );
    } else {
      return collection
        ?.insertOne({
          roomId: room._id,
          estimate,
          userId: new ObjectId(app?.currentUser?.id),
          name,
          _partitionKey: PUBLIC_PARTITION,
        })
        .then((data) => setEstimateId(data.insertedId));
    }
  };
}

export function useRefresh(
  collectionToWatch: Collections,
  filters: Record<string, any>
) {
  const collection = useCollection(collectionToWatch);
  const [renderIteration, rerender] = useReducer(
    (state: number) => state + 1,
    0
  );

  useEffect(() => {
    const watcher = async () => {
      if (!collection) return;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of collection.watch(filters)) {
        rerender();
      }
    };

    watcher().then();
  }, [collection, filters]);

  return renderIteration;
}

export function useEstimateHooks(id: string) {
  const { estimates, room } = useRoom(id);
  const createOrUpdateEstimate = useUpsertEstimate();
  return useMemo(
    () => ({
      estimates,
      room,
      createOrUpdateEstimate,
    }),
    [estimates, createOrUpdateEstimate, room]
  );
}
