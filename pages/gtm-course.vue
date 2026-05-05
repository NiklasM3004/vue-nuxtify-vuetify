<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- Sidebar: Curriculum -->
      <v-col cols="12" md="3" class="sidebar">
        <div class="pa-4">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-rocket-launch</v-icon>
            <span class="text-h6 font-weight-bold">GTM Engineering</span>
          </div>

          <v-progress-linear
            :model-value="overallProgress"
            color="primary"
            height="6"
            rounded
            class="mb-1"
          />
          <div class="text-caption text-medium-emphasis mb-4">
            {{ completedLessons }} / {{ totalLessons }} Lektionen abgeschlossen
          </div>

          <v-list density="compact" nav>
            <template v-for="(module, mIdx) in curriculum" :key="mIdx">
              <v-list-subheader class="text-uppercase font-weight-bold text-primary mt-2">
                Modul {{ mIdx + 1 }}: {{ module.title }}
              </v-list-subheader>
              <v-list-item
                v-for="(lesson, lIdx) in module.lessons"
                :key="lIdx"
                :active="activeLesson?.id === lesson.id"
                active-color="primary"
                rounded="lg"
                class="mb-1"
                @click="selectLesson(lesson)"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="lesson.completed ? 'success' : 'grey'"
                    size="18"
                    class="mr-1"
                  >
                    {{ lesson.completed ? 'mdi-check-circle' : 'mdi-play-circle-outline' }}
                  </v-icon>
                </template>
                <v-list-item-title class="text-body-2">{{ lesson.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ lesson.duration }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-list>
        </div>
      </v-col>

      <!-- Main Content -->
      <v-col cols="12" md="9" class="main-content">
        <!-- Video Player -->
        <div class="video-wrapper">
          <div class="video-player">
            <div v-if="!playing" class="play-overlay d-flex flex-column align-center justify-center" @click="playing = true">
              <v-btn icon size="x-large" color="white" variant="tonal" class="mb-3">
                <v-icon size="48">mdi-play</v-icon>
              </v-btn>
              <div class="text-h6 text-white font-weight-bold">{{ activeLesson?.title }}</div>
              <div class="text-caption text-white opacity-80 mt-1">{{ activeLesson?.duration }}</div>
            </div>
            <div v-else class="playing-state d-flex flex-column align-center justify-center">
              <v-icon size="64" color="white" class="mb-2">mdi-cast-education</v-icon>
              <div class="text-body-1 text-white">Lektion wird abgespielt...</div>
              <v-btn class="mt-4" variant="outlined" color="white" size="small" @click="completeLesson">
                Als abgeschlossen markieren
              </v-btn>
            </div>
          </div>

          <!-- Video Controls Bar -->
          <div class="controls-bar pa-3 d-flex align-center gap-3">
            <v-btn icon size="small" variant="text" @click="playing = !playing">
              <v-icon>{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
            <v-slider
              v-model="videoProgress"
              hide-details
              density="compact"
              color="primary"
              class="flex-grow-1"
            />
            <span class="text-caption text-medium-emphasis">{{ activeLesson?.duration }}</span>
            <v-btn icon size="small" variant="text">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text">
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Lesson Info -->
        <div class="pa-6">
          <div class="d-flex align-start justify-space-between flex-wrap gap-3 mb-4">
            <div>
              <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">
                {{ activeModuleTitle }}
              </div>
              <h2 class="text-h5 font-weight-bold">{{ activeLesson?.title }}</h2>
            </div>
            <div class="d-flex gap-2">
              <v-btn variant="outlined" size="small" @click="prevLesson" :disabled="isFirstLesson">
                <v-icon start>mdi-skip-previous</v-icon>Zurück
              </v-btn>
              <v-btn color="primary" size="small" @click="nextLesson" :disabled="isLastLesson">
                Weiter<v-icon end>mdi-skip-next</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Tabs: Beschreibung / Ressourcen / Notizen -->
          <v-tabs v-model="activeTab" color="primary" class="mb-4">
            <v-tab value="desc">Beschreibung</v-tab>
            <v-tab value="resources">Ressourcen</v-tab>
            <v-tab value="notes">Meine Notizen</v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab">
            <v-tabs-window-item value="desc">
              <p class="text-body-1 text-medium-emphasis">{{ activeLesson?.description }}</p>
              <div class="mt-4 d-flex flex-wrap gap-2">
                <v-chip
                  v-for="tag in activeLesson?.tags"
                  :key="tag"
                  size="small"
                  color="primary"
                  variant="tonal"
                >{{ tag }}</v-chip>
              </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="resources">
              <v-list>
                <v-list-item
                  v-for="(res, i) in activeLesson?.resources"
                  :key="i"
                  :prepend-icon="res.icon"
                  :title="res.name"
                  :subtitle="res.type"
                  rounded="lg"
                  class="mb-2"
                >
                  <template v-slot:append>
                    <v-btn icon size="small" variant="text" color="primary">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-tabs-window-item>

            <v-tabs-window-item value="notes">
              <v-textarea
                v-model="userNotes"
                label="Notizen zu dieser Lektion"
                placeholder="Schreibe hier deine Gedanken und Key-Takeaways..."
                variant="outlined"
                rows="6"
                auto-grow
              />
              <v-btn color="primary" class="mt-2" @click="saveNotes">
                <v-icon start>mdi-content-save</v-icon>Notizen speichern
              </v-btn>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="2500" color="success" location="bottom right">
      {{ snackbarMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

useHead({ title: 'GTM Engineering Kurs' })

const playing = ref(false)
const videoProgress = ref(0)
const activeTab = ref('desc')
const userNotes = ref('')
const snackbar = ref(false)
const snackbarMsg = ref('')

const curriculum = ref([
  {
    title: 'GTM Grundlagen',
    lessons: [
      {
        id: 1, title: 'Was ist GTM Engineering?', duration: '8:24', completed: true,
        description: 'Eine Einführung in die Disziplin GTM Engineering: Wie technische Systeme und Automatisierung den Go-To-Market-Prozess moderner SaaS-Unternehmen revolutionieren.',
        tags: ['Grundlagen', 'Überblick', 'GTM'],
        resources: [{ name: 'GTM Engineering Roadmap', type: 'PDF', icon: 'mdi-file-pdf-box' }, { name: 'Glossar', type: 'Dokument', icon: 'mdi-text-box' }],
      },
      {
        id: 2, title: 'Der GTM Stack im Überblick', duration: '12:05', completed: true,
        description: 'Welche Tools und Systeme bilden einen modernen GTM Stack? Wir schauen uns CRM, Marketing Automation, Sales Engagement und Data Enrichment an.',
        tags: ['Tech Stack', 'Tools', 'CRM'],
        resources: [{ name: 'GTM Stack Template', type: 'Spreadsheet', icon: 'mdi-google-spreadsheet' }],
      },
      {
        id: 3, title: 'Datenflüsse & Integrationen', duration: '15:30', completed: false,
        description: 'Wie fließen Daten zwischen Systemen? Von der ersten Website-Interaktion bis zum CRM-Eintrag — wir bauen eine saubere Daten-Pipeline.',
        tags: ['Daten', 'Integrationen', 'API'],
        resources: [{ name: 'Integration Diagram', type: 'Bild', icon: 'mdi-image' }, { name: 'Zapier vs. Make Vergleich', type: 'PDF', icon: 'mdi-file-pdf-box' }],
      },
    ],
  },
  {
    title: 'ICP & Segmentierung',
    lessons: [
      {
        id: 4, title: 'Ideal Customer Profile definieren', duration: '18:10', completed: false,
        description: 'Ein präzises ICP ist das Fundament jeder GTM-Strategie. Wir lernen, firmografische, technografische und Intent-Daten zu kombinieren.',
        tags: ['ICP', 'Segmentierung', 'Strategie'],
        resources: [{ name: 'ICP Worksheet', type: 'PDF', icon: 'mdi-file-pdf-box' }],
      },
      {
        id: 5, title: 'Lead Scoring mit Daten automatisieren', duration: '21:45', completed: false,
        description: 'Automatisches Lead Scoring auf Basis von Verhaltensdaten, Firmografics und Engagement. Wir implementieren ein scoring Modell in HubSpot.',
        tags: ['Lead Scoring', 'Automatisierung', 'HubSpot'],
        resources: [{ name: 'Scoring Model Template', type: 'Spreadsheet', icon: 'mdi-google-spreadsheet' }],
      },
    ],
  },
  {
    title: 'Outbound Automation',
    lessons: [
      {
        id: 6, title: 'Clay.com für Data Enrichment', duration: '25:00', completed: false,
        description: 'Clay ist das Schweizer Taschenmesser des GTM Engineers. Wir bauen einen automatisierten Enrichment-Flow, der Kontakte mit 30+ Datenpunkten anreichert.',
        tags: ['Clay', 'Enrichment', 'Outbound'],
        resources: [{ name: 'Clay Starter Template', type: 'Link', icon: 'mdi-link' }],
      },
      {
        id: 7, title: 'Personalisierte E-Mail-Sequenzen', duration: '19:20', completed: false,
        description: 'Wie schreibt man Outbound-E-Mails, die tatsächlich geöffnet werden? Wir verbinden Enrichment-Daten mit dynamischen Templates in Apollo/Lemlist.',
        tags: ['E-Mail', 'Personalisierung', 'Copywriting'],
        resources: [{ name: '10 bewährte E-Mail-Templates', type: 'PDF', icon: 'mdi-file-pdf-box' }],
      },
      {
        id: 8, title: 'LinkedIn Automation (compliant)', duration: '14:55', completed: false,
        description: 'LinkedIn-Outreach skalieren ohne gebannt zu werden. Wir lernen, innerhalb der Terms of Service zu arbeiten und trotzdem Ergebnisse zu erzielen.',
        tags: ['LinkedIn', 'Social Selling', 'Compliance'],
        resources: [{ name: 'LinkedIn Limits Cheatsheet', type: 'PDF', icon: 'mdi-file-pdf-box' }],
      },
    ],
  },
  {
    title: 'RevOps & Analytics',
    lessons: [
      {
        id: 9, title: 'Revenue Operations einrichten', duration: '22:15', completed: false,
        description: 'RevOps verbindet Sales, Marketing und Customer Success auf einer gemeinsamen Datenbasis. Wir bauen ein RevOps-Dashboard von Grund auf.',
        tags: ['RevOps', 'Dashboard', 'Analytics'],
        resources: [{ name: 'RevOps Metrics Framework', type: 'PDF', icon: 'mdi-file-pdf-box' }],
      },
      {
        id: 10, title: 'GTM Metriken & KPIs', duration: '17:40', completed: false,
        description: 'Welche Metriken wirklich wichtig sind: CAC, LTV, Magic Number, Pipeline Coverage. Wir bauen ein KPI-Modell in Notion oder Airtable.',
        tags: ['KPIs', 'Metriken', 'Reporting'],
        resources: [{ name: 'KPI Calculator', type: 'Spreadsheet', icon: 'mdi-google-spreadsheet' }],
      },
    ],
  },
])

const allLessons = computed(() => curriculum.value.flatMap(m => m.lessons))
const totalLessons = computed(() => allLessons.value.length)
const completedLessons = computed(() => allLessons.value.filter(l => l.completed).length)
const overallProgress = computed(() => Math.round((completedLessons.value / totalLessons.value) * 100))

const activeLesson = ref(allLessons.value[0])

const activeModuleTitle = computed(() => {
  const mod = curriculum.value.find(m => m.lessons.some(l => l.id === activeLesson.value?.id))
  return mod ? `Modul: ${mod.title}` : ''
})

const isFirstLesson = computed(() => allLessons.value[0]?.id === activeLesson.value?.id)
const isLastLesson = computed(() => allLessons.value[allLessons.value.length - 1]?.id === activeLesson.value?.id)

function selectLesson(lesson) {
  activeLesson.value = lesson
  playing.value = false
  videoProgress.value = lesson.completed ? 100 : 0
  userNotes.value = ''
  activeTab.value = 'desc'
}

function nextLesson() {
  const idx = allLessons.value.findIndex(l => l.id === activeLesson.value?.id)
  if (idx < allLessons.value.length - 1) selectLesson(allLessons.value[idx + 1])
}

function prevLesson() {
  const idx = allLessons.value.findIndex(l => l.id === activeLesson.value?.id)
  if (idx > 0) selectLesson(allLessons.value[idx - 1])
}

function completeLesson() {
  if (activeLesson.value) {
    activeLesson.value.completed = true
    playing.value = false
    videoProgress.value = 100
    snackbarMsg.value = '✓ Lektion als abgeschlossen markiert!'
    snackbar.value = true
  }
}

function saveNotes() {
  snackbarMsg.value = 'Notizen gespeichert!'
  snackbar.value = true
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}

.main-content {
  min-height: 100vh;
}

.video-wrapper {
  background: #000;
}

.video-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.play-overlay,
.playing-state {
  width: 100%;
  height: 100%;
}

.controls-bar {
  background: #111;
  gap: 8px;
}

.controls-bar .v-icon,
.controls-bar .text-caption {
  color: rgba(255, 255, 255, 0.8);
}
</style>
