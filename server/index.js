const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai")

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


const fs = require("fs");
//create uploads folder if not exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}



const analyzeResume = async (text) => {
    try {
        console.log("Analyzing resume:", text);

        const response = await model.generateContent({
            contents: [
                { parts: [{ text: `Analyze and give recommendations:\n\n${text}` }] }
            ]
        });

        const result = response.response.text(); // ✅ Получаем текст ответа
        console.log("Gemini Response:", result);

        return result;
    } catch (error) {
        console.error("Google API Error:", error.message);
        return "Error analyzing resume";
    }
};




app.post("/analyze", async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }


    try {
        const result = await analyzeResume(text);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "File was not uploaded" });
    }
    res.json({ filename: req.file.filename });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
