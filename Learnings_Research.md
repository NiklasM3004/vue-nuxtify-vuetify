vuetify => design library

nuxt => server side rendering (SEO-relevant)

vue.js => no classic HTML, CSS, Java/Typescript 
    => instead 
        <template> is HTML
        <style> is CSS
        <script setup>  is Logic / Java/Typescript




vuetify.ts => global design configuration file
DOCs for global vuetify config: https://vuetifyjs.com/en/features/global-configuration/#using-with-virtual-components

many different pre-designed components can be used via vuetify, like buttons, scroll bars etc.. Just use the v-xyz tag inside a .vue file to use a predesigned component

DOCs for component library: https://vuetifyjs.com/en/components/all/#containment


vue.js:

all elements together create a flexbox. the md="4" parameter is representing a relation to the fixed number 12. Thereby the width of the row is defined (for example md="4" => one third of the page)

The Flexbox is created by combination of row (rows) and col (columns)