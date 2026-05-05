# Kami AI 🤖

A sleek, feature-rich AI chat assistant powered by the [Groq API](https://console.groq.com/). Built with Flask (Python) on the backend and a custom HTML/CSS/JS frontend.

> Built by **Kamal Kumar**

---

## ✨ Features

- 💬 **Ask Anything** — General-purpose AI chat
- 🎯 **Interview Prep** — Structured mock interviews with feedback
- 📚 **Study Coach** — Topic explanations and practice questions
- 💻 **Code Help** — Debugging, code writing, and explanations
- 🌗 **Light / Dark Mode** — Toggle anytime
- 🧠 **Multi-Model Support** — Switch between LLaMA, Kimi K2, GPT OSS, Qwen and more
- 🗂️ **Chat History** — Session history saved in sidebar
- ⌨️ **Keyboard Shortcuts** — `Ctrl+K` for new chat, `Enter` to send

---

## 🖼️ Preview
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/934244f8-5898-4ae3-9014-013c16992fd2" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/37bc6ee0-c80e-4c57-8c45-05106e44dc5e" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f2137a3d-7d02-40fc-bda3-ece6b397067b" />

```
Sidebar  |  Welcome Screen → Chat Area
         |  [Feature Chips: Interview / Study / Code]
         |  [Input Box with Model Selector]
```

---

## 📁 Project Structure

```
kami-ai/
├── app.py              # Flask backend — handles /chat API route
├── requirements.txt    # Python dependencies
├── .env                # Your secret API key (YOU create this — see below)
├── .gitignore          # Should include .env
└── templates/
│   └── index.html      # Main frontend HTML
└── static/
    ├── css/
    │   └── style.css   # All styling
    └── js/
        └── main.js     # Frontend logic
```

> **Note:** Place `index.html` inside a `templates/` folder and `style.css` / `main.js` inside `static/css/` and `static/js/` respectively, as Flask expects this structure.

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Python 3.8+** → [Download Python](https://www.python.org/downloads/)
- **pip** (comes with Python)
- A free **Groq API Key** → [Get it here](https://console.groq.com/)

---

## 🚀 Setup & Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/kami-ai.git
cd kami-ai
```

### Step 2 — Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS / Linux:
source venv/bin/activate
```

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
| Package | Purpose |
|---|---|
| `flask` | Web framework for the backend |
| `requests` | Makes HTTP calls to the Groq API |
| `python-dotenv` | Loads your API key from the `.env` file |

---

## 🔑 Setting Up the `.env` File

This is the most important step. The `.env` file stores your secret Groq API key locally on your machine. **It is never committed to GitHub.**

### Step 1 — Get Your Groq API Key

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in (it's free)
3. Navigate to **API Keys** in the left sidebar
4. Click **"Create API Key"**
5. Copy the key — it looks like: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2 — Create the `.env` File

In the **root folder of the project** (same level as `app.py`), create a new file named exactly:

```
.env
```

> ⚠️ The filename starts with a dot (`.env`), not `env.txt` or `config.env`.

### Step 3 — Add Your API Key

Open the `.env` file and add this single line:

```env
GROQ_API_KEY=your_actual_api_key_here
```

**Example:**

```env
GROQ_API_KEY=gsk_abc123xyz456def789ghi000
```

> Replace `gsk_abc123xyz456def789ghi000` with your real key. Do not add quotes around it.

### ✅ Final `.env` File Should Look Like

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

That's it — just **one line**.

---

## 🛡️ Keeping Your API Key Safe

Make sure your `.env` file is **never uploaded to GitHub**. Create a `.gitignore` file in your project root (if it doesn't exist) and add:

```
.env
venv/
__pycache__/
*.pyc
```

---

## ▶️ Running the App

Once your `.env` file is ready:

```bash
python app.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

Open your browser and go to: **[http://localhost:5000](http://localhost:5000)**

---

## 🗂️ Folder Setup (Important!)

Flask requires specific folder names. Organize your files like this **before running**:

```
kami-ai/
├── app.py
├── requirements.txt
├── .env
├── .gitignore
├── templates/
│   └── index.html        ← put index.html here
└── static/
    ├── css/
    │   └── style.css     ← put style.css here
    └── js/
        └── main.js       ← put main.js here
```

---

## 🤖 Available AI Models

| Model | Speed | Best For |
|---|---|---|
| LLaMA 3.3 70B | Medium | Best quality answers |
| LLaMA 3.1 8B | Fastest | Quick responses |
| LLaMA 4 Scout | Medium | Multimodal tasks |
| Kimi K2 | Medium | Latest Moonshot AI model |
| GPT OSS 120B | Medium | Powerful OpenAI OSS |
| GPT OSS 20B | Fast | Lightweight OpenAI OSS |
| Qwen 3 32B | Medium | Reasoning tasks |

---

## 🧩 How It Works

```
User types a message in the browser
        ↓
main.js sends a POST request to /chat
        ↓
app.py receives the request and forwards it to Groq API
        ↓
Groq API returns the AI response
        ↓
app.py sends the reply back to the browser
        ↓
main.js displays the message in the chat
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `GROQ_API_KEY not set` error | Make sure `.env` file exists and key is correct |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again |
| Page not loading | Make sure `python app.py` is running and visit `http://localhost:5000` |
| `templates/index.html not found` | Move `index.html` into a folder named `templates/` |
| `static files not loading` | Move CSS/JS into `static/css/` and `static/js/` folders |
| Request timed out | Groq server may be busy — try again or switch to a faster model |

---

## 📜 License

This project is open-source and free to use for personal and educational purposes.

---

## 🙋 Author

**Kamal Kumar**  
Made with ❤️ using Flask + Groq API
