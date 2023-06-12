# Create a photo website

Copy this repository and run ```npm install``` in the installation folder.
1. Copy all photos into the installation folder's ```/photos``` folder.
2. In a terminal with the current directory set to the installation folder, run the command ```npm process-photos``` and it will resize the photos and record Exif information from the original photo and strip out all Exif information from the resized photo while writing it out to ```/src/assets/photos```.
3. Run the development version of the Astro website with the command ```npm run dev```.


## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── photos/
├── src/
│   └── content
│       └── assets
│   └── pages/
│       └── index.astro
└── package.json
```


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3000`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
