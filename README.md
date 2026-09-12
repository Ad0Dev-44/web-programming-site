# Web Programming — Portfolio Site (Starter)

A minimal Flask application that serves a portfolio home page. I am building on this
project every week; by the end of the semester it becomes a full web application.

## Run locally

```
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
flask run -debug
```

Then open http://127.0.0.1:5000

## Project structure

```
.
├─ app.py                      # Flask application and routes
├─ requirements.txt            # Python dependencies
├─ Procfile                    # Production start command (used by Render)
├─ .gitignore                  # Files Git should ignore
└─ templates/
   ├─ index.html               # Portfolio home page (Jinja template)
   ├─ internet-history.html    # Week 2: History of the Internet
   └─ web-history.html         # Week 2: History of the Web
```

## Routes

| Route               | Function            | Description                     |
|---------------------|----------------------|----------------------------------|
| `/`                  | `index()`            | Portfolio home page             |
| `/internet-history`  | `internet_history()` | History of the Internet page    |
| `/web-history`       | `web_history()`      | History of the Web page         |

## Deploy on Render

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

## Notes

- Never commit secrets. Put anything sensitive in a `.env` file, which is already ignored.
- Add each week's page or feature and link it from the "Weekly Work" list on the home page.
- When linking between pages, always use `url_for('function_name')` in Jinja templates —
  it must match the Python function name in `app.py`, not the URL path or filename.