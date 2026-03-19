to install dependencies and afterwards run the apllication do the following:

1. nmp install
2. npm run dev

content of nuxt/tsconfig.json needs to be:

{
  // Diese Zeile ist der Schlüssel: Sie holt sich alle Pfade und Typen automatisch
  "extends": "./.nuxt/tsconfig.json"
}