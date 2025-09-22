# Sundaram Rai's Portfolio Website

A modern, interactive, and responsive portfolio website showcasing Sundaram Rai's projects, skills, and experience. Built with a focus on smooth animations and an engaging user experience.

## Badges

[![Vercel Deployment Status](https://vercel.com/api/collections/sundaramrai/sundaram-portfolio/deployment-status)](https://vercel.com/sundaramrai/sundaram-portfolio)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents

- [Key Features](#key-features)

- [Architecture Overview](#architecture-overview)

- [Tech Stack](#tech-stack)

- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Project Structure](#project-structure)

- [Scripts](#scripts)

- [Roadmap](#roadmap)

- [Contributing](#contributing)

- [Testing](#testing)

- [License](#license)

- [Acknowledgements](#acknowledgements)

## Key Features

*   **Responsive Design:** Optimized for seamless viewing across various devices and screen sizes using Tailwind CSS.

*   **Interactive Animations:** Utilizes GSAP (GreenSock Animation Platform) and ScrollTrigger for engaging scroll-based and element-specific animations.

*   **Dynamic Typing Effect:** Features a custom TypeWriter class for animated text display on key sections.

*   **Custom Cursor:** Enhances user interaction with a custom cursor and hover effects for interactive elements.

*   **Parallax Backgrounds:** Implements subtle parallax scrolling effects for a dynamic visual experience.

*   **Project Card Interactions:** Engaging hover animations for project cards, revealing details and links.

*   **Optimized Build Process:** Leverages PostCSS and Tailwind CSS for efficient styling and a lean production build.

*   **Vercel Deployment:** Configured for easy and continuous deployment via Vercel.

## Architecture Overview

This project is a static portfolio website built primarily with HTML, CSS, and JavaScript. The styling is managed by Tailwind CSS, which is processed by PostCSS during the build step to generate optimized CSS. Interactive elements and animations are powered by the GreenSock Animation Platform (GSAP), including its ScrollTrigger plugin for scroll-based effects.

The site is designed as a single-page application (SPA) experience, though it's technically a multi-section static site, with JavaScript handling most of the dynamic content and user interface enhancements. Deployment is handled through Vercel, which builds the project and serves the static assets. There is no server-side component; all logic runs client-side.

## Tech Stack

| Area | Tool | Version |
|---|---|---|
|---|---|---|
| Frontend | HTML | N/A |
| Styling | Tailwind CSS | 3.x |
|---|---|---|
| Styling | PostCSS | 8.x |
| Styling | Autoprefixer | 10.x |
|---|---|---|
| Animation | GSAP | 3.x |
| Animation | ScrollTrigger (GSAP Plugin) | 3.x |
|---|---|---|
| Development Server | live-server | 1.x |
| Deployment | Vercel | 32.x |
|---|---|---|
| Package Manager | npm | N/A |



## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js and npm (or yarn/pnpm) installed on your system.

*   Node.js: [https://nodejs.org/](https://nodejs.org/)

*   npm: Usually comes with Node.js

*   Git: [https://git-scm.com/](https://git-scm.com/)

### Installation

1.  Clone the repository:

```bash
git clone https://github.com/sundaramrai/sundaram-portfolio.git

```
2.  Navigate into the project directory:

```bash
cd sundaram-portfolio

```
3.  Install the dependencies:

```bash
npm install

```
## Configuration

This project primarily uses `tailwind.config.js` and `postcss.config.js` for styling configuration, and `vercel.json` for deployment settings. There are no runtime environment variables that need to be set by the user for local development or deployment.

| ENV | Description | Example |
|---|---|---|
|---|---|---|
| N/A | No direct runtime environment variables are used. | N/A |



*   **`tailwind.config.js`**: Configures Tailwind CSS, including `darkMode`, `content` paths, and custom `theme` extensions.

*   **`postcss.config.js`**: Defines PostCSS plugins, specifically Tailwind CSS and Autoprefixer.

*   **`vercel.json`**: Specifies Vercel deployment settings, including build commands and routing rules.

## Usage

### Development

To start a local development server with live reloading and Tailwind CSS watching for changes:

```bash
npm start

```
This command uses `live-server` to serve the `index.html` and `tailwindcss --watch` to recompile your CSS.

### Building CSS

To compile the Tailwind CSS into a production-ready `dist/style.css` file:

```bash
npm run build

```
### Deployment

To deploy the project to Vercel (requires Vercel CLI and a linked project):

```bash
npm run deploy

```
This command will deploy the current state of your project to Vercel, forcing a production deployment.

## Project Structure

```
.

├── assets/
├── css/

│   └── style.css
├── dist/

│   └── style.css
├── js/

│   ├── gsap-init.js
│   └── main.js

├── index.html
├── package.json

├── postcss.config.js
├── tailwind.config.js

├── vercel.json
└── README.md

```
## Scripts

| Command | Description |
|---|---|
|---|---|
| `start` | Starts a local development server using `live-server`. |
| `test` | Placeholder for testing (currently echoes an error). |
|---|---|
| `build` | Compiles Tailwind CSS from `css/style.css` to `dist/style.css`. |
| `build:watch` | Compiles Tailwind CSS and watches for changes. |
|---|---|
| `dev` | Starts the Vercel development server. |
| `deploy` | Deploys the project to Vercel in production mode. |
|---|---|



## Roadmap

- [ ] Add a dedicated projects page with more detailed case studies.

- [ ] Implement a contact form submission backend (e.g., using Formspree or a serverless function).

- [ ] Enhance accessibility (ARIA attributes, keyboard navigation).

- [ ] Optimize image assets for faster loading.

- [ ] Add unit or integration tests for JavaScript modules.

- [ ] Implement a dark mode toggle for user preference.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Testing

The `package.json` includes a placeholder `test` script:

```json
"test": "echo \"Error: no test specified\" && exit 1"

```
Currently, there are no automated tests configured for this project. Future enhancements could include:

*   **Linting:** Integrate ESLint for code quality and consistency.

*   **Unit Tests:** Add unit tests for JavaScript modules (e.g., `TypeWriter`, `CursorManager`) using frameworks like Jest.

*   **End-to-End Tests:** Implement E2E tests with tools like Cypress or Playwright to ensure core functionalities and animations work as expected across the site.

## License

Distributed under the ISC License. See the `LICENSE` file (if present, otherwise implied by `package.json`) for more information.

## Acknowledgements

*   [GSAP](https://greensock.com/gsap/)

*   [Tailwind CSS](https://tailwindcss.com/)

*   [Vercel](https://vercel.com/)

*   [live-server](https://www.npmjs.com/package/live-server)
