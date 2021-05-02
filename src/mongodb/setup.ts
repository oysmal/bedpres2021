import {useEffect, useMemo, useState} from "react";
import {App, Credentials, User} from "realm-web";
import {Collections, estimate, room} from "./types";
import {ObjectId} from "bson";

const app = new App({id: "bedpres2021-bmkhz"});
const credentials = Credentials.anonymous();

async function setup(): Promise<Realm.User | null> {
    let user: User | null = null;

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
    return useMemo(() => mongo?.db("bedpres2021").collection(collectionName.toString()) ?? null, [collectionName, mongo]);
}

export function useRooms() {
    const [rooms, setRooms] = useState<room[]>([]);
    const roomsCollection = useCollection(Collections.Rooms);

    useEffect(() => {
        roomsCollection?.find({}).then(setRooms);
    }, [roomsCollection]);

    return rooms;
}

export function useRoom(id: string) {
    const [roomAndEstimates, setRoomAndEstimates] = useState<{room: room | null, estimates: estimate[]}>({room: null, estimates: []});
    const roomsCollection = useCollection(Collections.Rooms);
    const estimatesCollection = useCollection(Collections.Estimates);

    useEffect(() => {
        roomsCollection?.findOne({_id: new ObjectId(id)}).then(room => {
            estimatesCollection?.find({roomId: room._id}).then(estimates => {
                setRoomAndEstimates({room, estimates});
            })
        })
    }, [roomsCollection, estimatesCollection, id]);

    return roomAndEstimates;
}
