# Insan Nurjaman · Portfolio v3

A product design portfolio featuring selected case studies, shipped tools, and original design artifacts. Built with React, React Router, and Vite.

## Local development

Requires Node.js 24 and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:5182/. The earlier homepage concept is available in development at `/?layout=work-first`.

```sh
pnpm test
pnpm run build
pnpm preview --host 127.0.0.1 --port 5183
```

The build creates route-specific metadata, a sitemap, and readable HTML fallbacks. Local development and the public build require no environment file. The comment integration uses its existing public form endpoint. Automated tests use mock submissions.
