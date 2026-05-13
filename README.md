# Learning Hub

A self-paced engineering training portal built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Topics

| Topic | Status |
|---|---|
| AI in Practice | In Progress (19 sessions) |
| Azure DevOps Pipelines | Coming Soon |
| SQL & Database Fundamentals | Coming Soon |
| Azure Functions | Coming Soon |
| Azure Cosmos DB | Coming Soon |
| Azure Application Insights | Coming Soon |

## Development

```bash
npm install
npm run dev      # local dev server with live reload
npm run build    # build to _site/
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the site with Eleventy and deploys to GitHub Pages.
