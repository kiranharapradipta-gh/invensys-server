import express from "express";
import cors from 'cors'
import routes from "./routes";
import path from "path";

const app = express();
const PORT = 4120;

app.use(cors());
app.use(express.json({ limit: "50mb" })); // ✅ Correct
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // ✅ Support for form data
app.use(express.static(path.join(__dirname, "uploads")));

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});