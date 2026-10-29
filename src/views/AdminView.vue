<script setup>
import { ref, onMounted } from 'vue'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/services/subjectService'
import SubjectTable from '@/components/SubjectTable.vue'
import SubjectForm from '@/components/SubjectForm.vue'
import ImportBox from '@/components/ImportBox.vue'

const subjects = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')

const showForm = ref(false)
const showImport = ref(false)

const editingId = ref(null)
const formData = ref(null)

onMounted(() => {
  loadSubjects()
})

async function loadSubjects() {
  loading.value = true
  error.value = ''
  try {
    subjects.value = await getSubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not load the species list.'
  }
  loading.value = false
}

function startAdd() {
  editingId.value = null
  formData.value = null
  showImport.value = false
  showForm.value = true
}

function startImport() {
  showForm.value = false
  showImport.value = true
}

function startEdit(subject) {
  editingId.value = subject.$id
  formData.value = subject
  showImport.value = false
  showForm.value = true
}

function handleImport(data) {
  editingId.value = null
  formData.value = data
  showImport.value = false
  showForm.value = true
  message.value = 'Imported from iNaturalist. Check the details and save.'
}

async function handleSave(data) {
  error.value = ''
  try {
    if (editingId.value) {
      await updateSubject(editingId.value, data)
      message.value = 'Species updated.'
    } else {
      await createSubject(data)
      message.value = 'Species added.'
    }
    showForm.value = false
    editingId.value = null
    formData.value = null
    loadSubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not save. Are you logged in as an editor?'
  }
}

async function handleDelete(id) {
  error.value = ''
  try {
    await deleteSubject(id)
    message.value = 'Species deleted.'
    loadSubjects()
  } catch (err) {
    console.log(err)
    error.value = 'Could not delete this species.'
  }
}
</script>

<template>
  <main class="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-10">

    <h1 class="font-display font-bold text-3xl md:text-4xl mb-6">Admin</h1>

    <div class="flex flex-col sm:flex-row gap-3 mb-8">
      <button @click="startImport" class="bg-forest text-white font-bold px-6 py-3 rounded-full">
        Import from iNaturalist
      </button>
      <button @click="startAdd" class="bg-olive text-white font-bold px-6 py-3 rounded-full">
        Add by hand
      </button>
    </div>

    <ImportBox v-if="showImport" @import="handleImport" />

    <SubjectForm
      v-if="showForm"
      :key="editingId || 'new'"
      :subject="formData"
      @save="handleSave"
      @cancel="showForm = false"
    />

    <p v-if="message" class="bg-olive text-white rounded-lg p-3 mb-4">{{ message }}</p>
    <p v-if="error" class="bg-red-700 text-white rounded-lg p-3 mb-4">{{ error }}</p>

    <p v-if="loading">Loading species...</p>

    <p v-else-if="subjects.length === 0">No species yet. Import your first one!</p>

    <SubjectTable
      v-else
      :subjects="subjects"
      @edit="startEdit"
      @delete="handleDelete"
    />

  </main>
</template>