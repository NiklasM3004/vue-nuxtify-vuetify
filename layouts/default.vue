<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="Mein Projekt"
          subtitle="Nuxt & Vuetify Expert"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Team" value="team" to="/team"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Task-Pulse Dashboard"></v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>