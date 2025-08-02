# 📲 WhatsApp Google Drive Assistant

This **n8n** workflow allows you to manage your **Google Drive** via **WhatsApp messages**. Users can interact with the system using simple commands like `LIST`, `DELETE`, `MOVE`, and `SUMMARY` by sending a message to a Twilio WhatsApp number.

---

## ✨ Features

- 📁 **LIST**: Lists files in a Google Drive folder.
- ✂️ **DELETE**: Deletes a file or folder (requires `CONFIRM` keyword).
- 🔁 **MOVE**: Moves a file/folder to a new folder.
- 📄 **SUMMARY**: Uses OpenAI to summarize the contents of files.
- 💬 **HELP**: Sends back supported commands (optional).

---

## 🧩 Requirements

- ✅ Twilio account with WhatsApp sandbox enabled.
- ✅ Google Drive account with appropriate permissions.
- ✅ An n8n instance (Docker-based setup recommended).
- ✅ `ngrok` or similar tunnel (for local webhook exposure).

---

## ⚙️ Setup Instructions

### 1️⃣ Environment Variables

Create a `.env` file in the root directory by copying `.env.sample` and filling in the following:

```env
N8N_USER=admin
N8N_PASSWORD=password
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_SHEET_ID=...
OPENAI_API_KEY=sk-...
````

Then run:

```bash
docker-compose up -d
```

---

### 2️⃣ Twilio Sandbox Setup

1. Go to **Twilio Console** → **Messaging** → **WhatsApp Sandbox**.
2. Set **Webhook URL** to:

   ```
   https://<your-ngrok-subdomain>.ngrok-free.app/webhook/whatsapp-bot
   ```
3. Join the sandbox using the code Twilio gives you.

---

### 3️⃣ Import Workflow to n8n

1. Open [http://localhost:5678](http://localhost:5678) or your n8n tunnel link.
2. Login using your N8N credentials.
3. Import `workflow.json` and activate the workflow.

---

## 🧠 Command Syntax

| Command | Format                                   | Example               |
| ------- | ---------------------------------------- | --------------------- |
| List    | `LIST <folder_id>`                       | `LIST 1AbcD1234XYZ`   |
| Delete  | `DELETE <file_id> CONFIRM`               | `DELETE 1xYz CONFIRM` |
| Move    | `MOVE <file_id> <destination_folder_id>` | `MOVE 1xYz 1AbcD`     |
| Summary | `SUMMARY <folder_id>`                    | `SUMMARY 1AbcD`       |
| Help    | `HELP`                                   | `HELP`                |

---

## 🧪 Example Message Parsing Code (Code Node)

```javascript
const body = $json.Body || $json.body?.Body;
const sender = $json.From || $json.body?.From;

if (!body) {
  throw new Error("Missing 'Body' in incoming request.");
}

let command = 'UNKNOWN';
let sourcePath = '';
let destinationPath = '';

const trimmed = body.trim();

if (/^LIST\s+.+/i.test(trimmed)) {
  command = 'LIST';
  sourcePath = trimmed.split(/\s+/)[1];
} else if (/^DELETE\s+.+\s+CONFIRM$/i.test(trimmed)) {
  command = 'DELETE';
  sourcePath = trimmed.match(/^DELETE\s+(.+)\s+CONFIRM$/i)[1].trim();
} else if (/^MOVE\s+.+\s+.+/i.test(trimmed)) {
  const parts = trimmed.split(/\s+/);
  command = 'MOVE';
  sourcePath = parts[1];
  destinationPath = parts[2];
} else if (/^SUMMARY\s+.+/i.test(trimmed)) {
  command = 'SUMMARY';
  sourcePath = trimmed.split(/\s+/)[1];
}

return [
  {
    json: {
      command,
      sourcePath,
      destinationPath,
      sender: sender || "unknown",
      rawMessage: trimmed
    }
  }
];
```

---

## 🐳 Docker Setup

Use the provided `docker-compose.yml` to quickly spin up n8n:

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
whatsapp-drive-assistant/
├── README.md               # ✅ Project explanation
├── docker-compose.yml      # 🐳 Docker setup
├── .env.sample             # 🔐 Sample environment config
├── workflow.json           # 🔄 Importable n8n workflow
├── helper/
│   └── parseCommand.js     # 🧠 Command parsing logic
└── demo.mp4 (optional)     # 🎥 Demo video
```

---

## 🎥 Demo

> *(Add link to your demo video here or upload demo.mp4 if <100 MB)*

---

## 🛡️ Security Tips

* Always use `.env` for secrets. Never hardcode them.
* Protect your n8n editor with `N8N_USER` and `N8N_PASSWORD`.
* Avoid exposing sensitive nodes unless authenticated.

---

## 📌 Credits

Built with ❤️ using [n8n.io](https://n8n.io), [Twilio](https://twilio.com/whatsapp), and [Google Drive API](https://developers.google.com/drive).

---

