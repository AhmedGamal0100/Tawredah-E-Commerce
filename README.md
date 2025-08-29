# TawredahApp

TawredahApp is a modern, scalable web application built with [Angular](https://angular.dev/) designed to streamline product sourcing, customization requests, and supplier interactions. The project leverages Angular best practices, modular architecture, and integrates with Firebase for backend services.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Additional Resources](#additional-resources)

## Features

- **Product Catalog**: Browse and search products with advanced filtering.
- **Customization Requests**: Suppliers can view and manage product customization requests.
- **Wishlist & Cart**: Users can add products to their wishlist or cart.
- **Responsive Design**: Fully responsive UI for desktop and mobile.
- **Supplier Dashboard**: Tools for suppliers to manage products and requests.
- **Firebase Integration**: Authentication, hosting, and database support.
- **Unit & E2E Testing**: Comprehensive test coverage using Angular CLI.

## Project Structure

```
tawredah-angular-app/
  tawredah-app/
    src/
      app/
        shared/
          components/
            supplier/
              customization-requests/
                customization-requests.html
                customization-requests.css
            new-big-product-card/
              new-big-product-card.html
      index.html
      main.ts
    public/
      ...assets...
    .editorconfig
    .gitignore
    angular.json
    firebase.json
    package.json
    README.md
    tsconfig*.json
```

- **src/app/shared/components**: Reusable UI components such as product cards and supplier customization requests.
- **public/**: Static assets (SVGs, icons, videos).
- **angular.json**: Angular CLI configuration.
- **firebase.json**: Firebase hosting configuration.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.dev/tools/cli)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-org/tawredah-angular-app.git
    cd tawredah-angular-app/tawredah-app
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

## Development

### Start the Development Server

```sh
ng serve
```
Visit [http://localhost:4200/](http://localhost:4200/) to view the app.

### Code Scaffolding

Generate a new component:
```sh
ng generate component component-name
```
For more schematics:
```sh
ng generate --help
```

### Building for Production

```sh
ng build
```
Build artifacts will be stored in the `dist/` directory.

## Testing

### Unit Tests

Run unit tests with [Karma](https://karma-runner.github.io):
```sh
ng test
```

### End-to-End Tests

Run e2e tests:
```sh
ng e2e
```
> Note: Configure your preferred e2e framework as Angular CLI does not include one by default.

## Deployment

### Firebase Hosting

1. Build the project:
    ```sh
    ng build --prod
    ```
2. Deploy to Firebase:
    ```sh
    firebase deploy
    ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Tutorials](https://angular.dev/tutorials)
- [Firebase Documentation](https://firebase.google.com/docs)
