# GitHub Actions

This repository uses GitHub Actions to validate builds on every push and pull request.

## Workflow

- File: `.github/workflows/ci-build.yml`
- Trigger: all branches on `push` and `pull_request`

## What it runs

1. Backend job (`BackEnd/Api`)
- Install Python 3.9
- Install dependencies from `requirements.txt`
- Run `python manage.py check`
- Run `python manage.py test`

2. Frontend job (`FrontEnd`)
- Install Node.js 18
- Install dependencies (`npm ci` if lockfile exists, otherwise `npm install`)
- Run `npm run build`
- Upload `FrontEnd/dist` as an artifact

## How to use it

1. Push changes to any branch or open a pull request.
2. Open the **Actions** tab in GitHub.
3. Check the `CI Build` workflow status.
4. Download `frontend-dist` artifact if you need the built frontend bundle.

## Notes

- If backend tests are not ready yet, you can temporarily remove or relax the `python manage.py test` step.
- If you use a different Node or Python version in production, update the workflow versions to match.
