import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};


const dbConnect = async()=>{
    // checking if the user is already connected to the database
    if(connection.isConnected){
        console.log('Already connected to the database');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully');

    } catch (error) {
        console.error('Database connection failed:', error);
        // exit in case of a connection error
        process.exit(1);
    }
}

export default dbConnect
