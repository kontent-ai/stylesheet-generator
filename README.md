# Kontent.ai custom element stylesheet generator

A repository for management and deployment of SCSS/CSS files with pre-defined classes in line with Kontent.ai application interface. Suitable for custom element development.

For a showcase of the classes and its capabilities, see the [styles readme](styles/README.md).

## Usage

Clone the repository, adjust the **styles.scss** file accordingly and run `npm run convert` to build the **styles.css** file and its map.

## Deployment

Release a new version whenever you introduce changes. The deployment script will run the build command and deploy contents of the **styles** folder to npm.