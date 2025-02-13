import { MongoClient, ServerApiVersion,  } from "mongodb";          

if(!process.env.MONGO_URI) {
    throw new Error("Invalid/Misssing Environment Variable")
}
const uri = process.env.MONGO_URI;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

let client;
let clientPromise;
// HOT RELOADING
if(process.env.NODE_ENV === "development") {  
    let globalWithMongo = global;
    globalWithMongo._mongoClientPromise = undefined;

    if(!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
}else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}
export default clientPromise;

// Development scenario:

// First load: No connection exists → Creates new connection and stores it in global
// Make code change → Hot reload occurs
// Second load: Connection exists in global → Reuses existing connection
// Make another change → Hot reload occurs
// Third load: Connection still exists in global → Still reusing same connection

// Production scenario:

// Server starts → Creates new connection
// Server runs continuously → Uses same connection
// If server restarts → Creates new connection

// This pattern is particularly important because MongoDB has a limit on how many connections you can have to your database at once. In development, without this pattern, you might hit that limit just by saving your files a few times!
