const express = require("express");
const app = express();
const port = 3000;
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use(express.json()); // Middleware to parse JSON bodies

const upload = multer({ dest: "uploads/" });

// const resultDir = path.join(__dirname, "result");
// const resultFile = path.join(resultDir, `${Date.now()}.log`);

// const logStream = fs.createWriteStream(resultFile, { flags: "a" });

const log = (message) => {
  console.log(message);
  // logStream.write(`${new Date().toISOString()} - ${message}\n`);
};

// Function to call Gemini API and analyze conversations
async function analyzeWithGemini(conversations, basePrompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash-lite",
  });

  // Prepare the prompt or input for Gemini
  const prompt = `${basePrompt}\n\n${JSON.stringify(conversations)}`;

  try {
    console.log(prompt);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/analyse", upload.single("file"), (req, res) => {
  console.log("YO!!BRO!!");
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = path.join(__dirname, req.file.path);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const conversations = {};

    parse(
      fileContent,
      { columns: true, skip_empty_lines: true },
      (err, records) => {
        if (err) {
          console.error("CSV parse error:", err);
          return res.status(400).send("Invalid CSV file");
        }

        records.forEach((item) => {
          conversations[item.conversation_id] = conversations[
            item.conversation_id
          ]
            ? [...conversations[item.conversation_id], item]
            : [item];
        });

        (async () => {
          //   for (const id of Object.keys(conversations)) {
          try {
            console.log(
              req.body.conversationId,
              conversations[req.body.conversationId],
              conversations
            );
            const data = await analyzeWithGemini(
              conversations[req.body.conversationId],
              req.body.basePrompt
            );
            console.log(data);
            log(data.match(/\{[\s\S]*?\}/)[0]);
            res.send(data.match(/\{[\s\S]*?\}/)[0]);
            return;
            // await delay(5000);
          } catch (err) {
            console.log(err);
          }
          // }
        })();
        fs.unlink(filePath, () => {});
      }
    );
  } catch (err) {
    console.log("ERR", err);
  }
});

app.post("/bulkAnalyse", upload.single("file"), (req, res) => {
  console.log("YO!!BRO!!");
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = path.join(__dirname, req.file.path);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const conversations = {};

    parse(
      fileContent,
      { columns: true, skip_empty_lines: true },
      (err, records) => {
        if (err) {
          console.error("CSV parse error:", err);
          return res.status(400).send("Invalid CSV file");
        }

        records.forEach((item) => {
          conversations[item.conversation_id] = conversations[
            item.conversation_id
          ]
            ? [...conversations[item.conversation_id], item]
            : [item];
        });

        (async () => {
          //   for (const id of Object.keys(conversations)) {
          try {
            console.log(
              req.body.conversationId,
              conversations[req.body.conversationId]
            );
            const data = await analyzeWithGemini(
              conversations[req.body.conversationId],
              req.body.basePrompt
            );
            console.log(data);
            log(data.match(/\{[\s\S]*?\}/)[0]);
            res.send(data.match(/\{[\s\S]*?\}/)[0]);
            return;
            // await delay(5000);
          } catch (err) {
            console.log(err);
          }
          // }
        })();
        fs.unlink(filePath, () => {});
      }
    );
  } catch (err) {
    console.log("ERR", err);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
