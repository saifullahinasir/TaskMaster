const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://saifullahin677:08066516657Sa@cluster0.ubdlw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        
        // Set up error handling for the connection
        mongoose.connection.on('error', (err) => {
            console.log('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
