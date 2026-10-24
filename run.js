// Set webcontainer flag so Next.js seamlessly uses @next/swc-wasm-nodejs
process.versions.webcontainer = '1';

// Pass arguments to next cli
process.argv = [process.argv[0], process.argv[1], ...process.argv.slice(2)];

require('next/dist/bin/next');
