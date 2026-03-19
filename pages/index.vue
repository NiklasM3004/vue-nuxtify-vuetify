<template>
  <v-container>
    <v-row mt-5>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Willkommen im Dashboard</h1>
        <p class="text-body-1 mb-8">Dieses Projekt demonstriert Nuxt 3, Vue 3 und Vuetify.</p>
      </v-col>

      <v-col cols="12" md="4">
        <v-card border color="primary" variant="tonal" class="pa-4">
          <v-card-item title="Aktive Aufgaben">
            <template v-slot:subtitle> Letzte 7 Tage </template>
          </v-card-item>
          <v-card-text class="text-h2">12</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card item="Projektfortschritt" subtitle="Meilensteine 2024">
          <v-card-text>
            <v-progress-linear color="success" model-value="75" height="20" striped></v-progress-linear>
            <div class="mt-4 d-flex justify-space-between">
              <span>Frontend Entwicklung</span>
              <strong>75%</strong>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary">Details ansehen</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Hier kannst du später deine Logik hinzufügen (Composables etc.)
</script>