# Shataranj

A JavaScript library for building chess (shatranj) game. This library provides core chess logic, piece movement, and canvas rendering to visualize the chessboard and pieces.

## Features

- Chessboard setup and piece movement
- Valid move generation for each piece
- Canvas rendering for visual representation
- Easily integrable into web applications

## Installation

You can install the library via npm:

```sh
npm install shataranj
```

## Usage

### Basic Usage

To use the library in a JavaScript project, import the necessary modules and initialize a new game:

```javascript
import Shatranj from "shataranj";

const game = new Shatranj("chess-board");

game.init();
```

**Note:** For more see [example](./examples/shatranj.html).

## Development

### Building the Library

To build the library and create a minified bundle, run:

```sh
npm run build
```

This will output the minified library to the `dist` folder.

### Run & Test

- Run `npm run build`
- `dist` folder contain CDN Files
- Open `example/shatranj.html` in browser

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
