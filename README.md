# Gedanite

A simple AI-driven app to assist in studying for the GED. Currently, it generates its own GED-like questions, and it'll evaluate your answer/explanation.

After installing client and server dependencies, simply run the included `app.sh` script to start it up; this will run both the client and the server. A `.env` file needs to be added as well that will include your Claude API key.

If this were to be developed further, instead of having the AI generate hypothetical questions, I'd utilize a database of questions with expected answer justifications for the AI to evaluate against. I'd also potentially store user history to track categories and sub-categories where the user is doing well and where they could improve.
