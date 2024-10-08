# Merch At Scale
This project is a library of web components providing merchandising content to various surfaces.

## Environments
- Preview: https://main--mas--adobecom.hlx.page/
- Live: https://main--mas--adobecom.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development
```
npm run build
npm run studio
```

'npm run studio' will start a proxy to Odin QA on localhost:8080 and run 'aem up' that will start Milo Studio on localhost:3000

Refer to the corresponding README.md under any of the packages:
* studio - M@S Studio for creating, updating and publishing merch fragments
* ost-audit - crawls EDS pages HTML for OST links and generates a CSV report

## Local development + Milo
Want to test your Milo feature branch changes with Studio on local? 
In Milo root run
```
aem up --port 6456
```

#### Troubleshooting
Please reach out to us in `#tacocat-friends` for any questions.