import dotenv from "dotenv";
import app from "./app/app.js";
import connectDB from "./db/index.js"

dotenv.config(
    {
        path: "./.env"
    }
)

const PORT = process.env.PORT ?? 5000;



connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error("❌Error connecting to MongoDB:", error);
        process.exit(1);
    })

