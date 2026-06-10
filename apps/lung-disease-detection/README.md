# GitHub Pages Frontend

This folder contains the original compiled frontend adapted for GitHub Pages.
The UI bundle and stylesheet come from `deployment/frontend`.

Backend API:

```text
https://a1mohamadd-lung-disease-detection-api.hf.space
```

To change the backend later, edit `config.js`.

Upload these files to GitHub Pages:

```text
new_frontend/index.html
new_frontend/styles.css
new_frontend/config.js
new_frontend/app.js
new_frontend/favicon.svg
```

Do not put private keys, database URLs, Supabase service keys, or `LOGS_API_KEY`
inside this frontend. GitHub Pages is public.
