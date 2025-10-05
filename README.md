# Ulda Sign

Advanced cryptographic signature library with a ladder-based verification system.

## Features

- 🔐 **Advanced cryptography**: Multiple hash algorithms (SHA-1, SHA-256, SHA-384, SHA-512, SHA3-256, SHA3-512, BLAKE3, WHIRLPOOL)
- 🪜 **Ladder verification**: Two verification modes (S and X) for different use cases
- 🔧 **Pluggable hashers**: External/custom hash functions via CDN or your own implementation
- 📦 **Multiple formats**: Hex, Base64, and raw bytes
- 🌐 **Cross-platform**: Works in Node.js and browsers
- 📝 **TypeScript**: Full type definitions

## Installation

```bash
npm install @zeroam/ulda-sign
# or
pnpm add @zeroam/ulda-sign
# or
yarn add @zeroam/ulda-sign
```

## Getting Started

Basic end-to-end flow: create an origin, sign it twice (step-up the origin between signatures), and verify the pair.

```typescript
import UldaSign from '@zeroam/ulda-sign';

// Initialize
const ulda = new UldaSign();

// 1) Create the first origin and sign it
const origin1 = ulda.New();
const signature1 = await ulda.sign(origin1);

// 2) Step up the origin and sign again
const origin2 = ulda.stepUp(origin1);
const signature2 = await ulda.sign(origin2);

// 3) Verify two signatures (signature1 vs signature2)
const isValid = await ulda.verify(signature1, signature2);
console.log('valid:', isValid);
```



## Advanced Configuration

```typescript
import UldaSign from '@zeroam/ulda-sign';

const ulda = new UldaSign({
  version: '1',
  fmt: { export: 'hex' }, // or 'base64', 'bytes'
  sign: {
    N: 5,              // number of blocks
    mode: 'S',         // verification mode: 'S' or 'X'
    hash: 'SHA-256',   // hash algorithm
    originSize: 256,   // origin size in bits
    pack: 'simpleSig'  // packing method
  },
  externalHashers: {
    'custom-hash': {
      fn: async (data: Uint8Array) => customHashFunction(data),
      output: 'hex',
      size: 256,
      cdn: null,
      ready: true
    }
  }
});
```

### Verification Modes

#### Mode S (Sequential)
```typescript
const ulda = new UldaSign({ sign: { mode: 'S' } });
```

#### Mode X (Cross)
```typescript
const ulda = new UldaSign({ sign: { mode: 'X' } });
```

### Step-Up Process Only

```typescript
const origin = ulda.New();
const nextOrigin = ulda.stepUp(origin);
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

## Browser Usage (CDN)

IIFE build exposes a global `UldaSign`:

```html
<!-- unpkg (latest) -->
<script src="https://unpkg.com/@zeroam/ulda-sign/dist/ulda-sign.iife.js"></script>
<!-- or pin a version -->
<!-- <script src="https://unpkg.com/@zeroam/ulda-sign@1.x/dist/ulda-sign.iife.js"></script> -->

<!-- jsDelivr alternative -->
<!-- <script src="https://cdn.jsdelivr.net/npm/@zeroam/ulda-sign/dist/ulda-sign.iife.js"></script> -->

<script>
  const ulda = new UldaSign();
  const origin = ulda.New();
  // ...
</script>
```

## Node.js Usage

```javascript
// ESM
import UldaSign from '@zeroam/ulda-sign';

// CommonJS
// const UldaSign = require('@zeroam/ulda-sign');

const ulda = new UldaSign();
const origin = ulda.New();
```

## Related Packages

- NPM (ulda): https://www.npmjs.com/package/ulda
  - Install: `npm install @zeroam/ulda`

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

This project is licensed under **ULDA-NC-1.0**. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
