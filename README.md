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
└─ static/
   ├─ images/
      ├─ Arpanet1969.jpeg
      ├─ Netwrok.jpeg
      ├─ WebDesign.jpg
      └─ WebWithTIm.jpeg
   ├─ form_style.css           # Styling for the student form
   ├─ my_style.css             # General static styling for the whole website
   ├─ quiz.css                 # Styling for the quiz page
   └─ quiz.js                  # Javascript bakend code for the quiz
└─ templates/
   ├─ base.html                # Base layout extended by every page
   ├─ index.html               # Portfolio home page (Jinja template)
   ├─ OriginalHtml.html        # Week 1: Original index.html (pure html)
   ├─ internet-history.html    # Week 2: History of the Internet
   ├─ web-history.html         # Week 2: History of the Web
   ├─ internet-history-ai.html # Week 2: History of the Internet (AI generated)
   ├─ web-history-ai.html      # Week 2: History of the Web (AI generated)
   ├─ personal-research.html   # Week 3: Forms, Buttons & CSS Research 
   ├─ profile.html             # Week 4: Engineering Student Profile 
   ├─ profile-form.html        # Week 4: Engineering Student Profile Form (submitted data)
   ├─ javascript-research.html # Week 5: Research on jscript, ECMAScript, IIFE, Variadic Functions and Rest Parameter Functions
   └─ quiz.html                # Week 5: Javascript quiz
```

## Routes

| Route                  | Function                | Description                                                           |
|------------------------|-------------------------|-----------------------------------------------------------------------|
| `/`                    | `index()`               | Portfolio home page                                                   |
| `/internet-history`    | `internet_history()`    | History of the Internet page                                          |
| `/web-history`         | `web_history()`         | History of the Web page                                               |
| `/internet-history-ai` | `internet_history_ai()` | History of the Internet page (ai)                                     |
| `/web-history-ai`      | `web_history_ai()`      | History of the Web page (ai)                                          |
| `/personal-research`   | `personal_research()`   | Forms, Buttons & CSS research page                                    |
| `/original-html`       | `original_html()`       | Original html of the index page                                       |
| `/submit-profile`      | `submit_profile()`      | Shows the profile form (GET) and renders the submitted profile (POST) | 
| `/quiz`                | `quiz()`                | JavaScript quiz page                                                  |
| `/javascript-research` | `javascript_research()` | JavaScript Research page                                              |
 

## Deploy on Render

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`

## Notes

- Never commit secrets. Put anything sensitive in a `.env` file, which is already ignored.
- Add each week's page or feature and link it from the "Weekly Work" list on the home page.
- When linking between pages, always use `url_for('function_name')` in Jinja templates —
  it must match the Python function name in `app.py`, not the URL path or filename.