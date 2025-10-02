# Ulda Sign

Advanced cryptographic signature library with ladder-based verification system.

## Features

- 🔐 **Advanced Cryptography**: Multiple hash algorithms support (SHA-1, SHA-256, SHA-384, SHA-512, SHA3-256, SHA3-512, BLAKE3, WHIRLPOOL)
- 🪜 **Ladder-based Verification**: Two verification modes (S and X) for different use cases
- 🔧 **Custom Hashers**: Support for external hash functions via CDN or custom implementations
- 📦 **Multiple Formats**: Support for hex, base64, and binary data formats
- 🌐 **Cross-platform**: Works in Node.js and browsers
- 📝 **TypeScript**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install ulda-sign
```

## Usage

### Basic Usage

```typescript
import UldaSign from 'ulda-sign';

// Create a new instance
const ulda = new UldaSign();

// Generate a new origin package
const origin = ulda.New();

// Sign the origin
const signature = await ulda.sign(origin);

// Verify two signatures
const isValid = await ulda.verify(signature1, signature2);
```

### Advanced Configuration

```typescript
import UldaSign from 'ulda-sign';

const ulda = new UldaSign({
  version: "1",
  fmt: { export: "hex" }, // or "base64", "bytes"
  sign: {
    N: 5,              // Number of blocks
    mode: "S",         // Verification mode: "S" or "X"
    hash: "SHA-256",   // Hash algorithm
    originSize: 256,   // Origin size in bits
    pack: "simpleSig"  // Packing method
  },
  externalHashers: {
    "custom-hash": {
      fn: async (data: Uint8Array) => {
        // Your custom hash implementation
        return customHashFunction(data);
      },
      output: "hex",    // Output format
      size: 256,        // Hash size in bits
      cdn: null,        // CDN URL for external library
      ready: true       // Whether the hasher is ready
    }
  }
});
```

### Verification Modes

#### Mode S (Sequential)
```typescript
const ulda = new UldaSign({
  sign: { mode: "S" }
});
```

#### Mode X (Cross)
```typescript
const ulda = new UldaSign({
  sign: { mode: "X" }
});
```

### Step Up Process

```typescript
// Create initial origin
const origin = ulda.New();

// Step up to next version
const nextOrigin = ulda.stepUp(origin);

// Sign the new version
const signature = await ulda.sign(nextOrigin);
```

## API Reference

### Constructor

```typescript
new UldaSign(config?: UldaSignConfig)
```

### Methods

#### `New(index?: bigint): string | Uint8Array`
Creates a new origin package.

#### `sign(pkg: Uint8Array | string): Promise<string | Uint8Array>`
Signs an origin package.

#### `verify(a: Uint8Array | string, b: Uint8Array | string): Promise<boolean>`
Verifies two signatures.

#### `stepUp(pkg: Uint8Array | string): string | Uint8Array`
Creates the next version of an origin package.

### Types

```typescript
interface UldaSignConfig {
  version?: string;
  fmt?: { export?: string };
  sign?: {
    N?: number;
    mode?: string;
    hash?: string;
    originSize?: number;
    pack?: string;
    func?: (u8: Uint8Array) => Promise<Uint8Array | string> | Uint8Array | string;
    output?: string;
    cdn?: string;
  };
  externalHashers?: Record<string, ExternalHasher>;
}
```

## Browser Usage

The library automatically attaches to the global `window` object in browsers:

```html
<script src="https://unpkg.com/@zeroam/ulda-sign/dist/ulda-sign.iife.js"></script>
<script>
  const ulda = new UldaSign();
  const origin = ulda.New();
</script>
```

## Node.js Usage

```javascript
const UldaSign = require('ulda-sign');

const ulda = new UldaSign();
const origin = ulda.New();
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Development build with watch
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
