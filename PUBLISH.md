# Publishing to NPM

## Prerequisites

1. Create an account on [npmjs.com](https://www.npmjs.com)
2. Login to npm from command line:
   ```bash
   npm login
   ```

## Publishing Steps

1. **Build the library:**
   ```bash
   npm run build
   ```

2. **Test the build:**
   ```bash
   node -e "console.log(require('./dist/ulda-sign.cjs.js'))"
   ```

3. **Check what will be published:**
   ```bash
   npm pack --dry-run
   ```

4. **Publish to npm:**
   ```bash
   npm publish
   ```

## Version Management

- **Patch version** (bug fixes): `npm version patch`
- **Minor version** (new features): `npm version minor`
- **Major version** (breaking changes): `npm version major`

## After Publishing

The package will be available at:
- NPM: https://www.npmjs.com/package/ulda-sign
- CDN: https://unpkg.com/ulda-sign

## Usage Examples

### ES Modules
```javascript
import UldaSign from 'ulda-sign';
```

### CommonJS
```javascript
const UldaSign = require('ulda-sign');
```

### Browser (CDN)
```html
<script src="https://unpkg.com/@zeroam/ulda-sign/dist/ulda-sign.iife.js"></script>
```

### TypeScript
```typescript
import UldaSign, { UldaSignConfig } from 'ulda-sign';
```
