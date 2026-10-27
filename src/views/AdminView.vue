<script setup>
import { ref, onMounted } from 'vue'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/services/subjectService'
import SubjectTable from '@/components/SubjectTable.vue'
import SubjectForm from '@/components/SubjectForm.vue'

const subjects = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')

const showForm = ref(false)
const editing = ref(null)

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
  editing.value = null
  showForm.value = true
}

function startEdit(subject) {
  editing.value = subject
  showForm.value = true
}

async function handleSave(data) {
  error.value = ''
  try {
    if (editing.value) {
      await updateSubject(editing.value.$id, data)
      message.value = 'Species updated.'
    } else {
      await createSubject(data)
      message.value = 'Species added.'
    }
    showForm.value = false
    editing.value = null
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
  <main class="max-w-[1200px] mx-auto px-6 py-10">

    <h1 class="font-display font-bold text-4xl mb-6">Admin</h1>

    <button v-if="!showForm" @click="startAdd" class="bg-olive text-white font-bold px-6 py-3 rounded-full mb-8">
      Add a species
    </button>

    <SubjectForm
      v-if="showForm"
      :key="editing ? editing.$id : 'new'"
      :subject="editing"
      @save="handleSave"
      @cancel="showForm = false"
    />

    <p v-if="message" class="bg-olive text-white rounded-lg p-3 mb-4">{{ message }}</p>
    <p v-if="error" class="bg-red-700 text-white rounded-lg p-3 mb-4">{{ error }}</p>

    <p v-if="loading">Loading species...</p>

    <p v-else-if="subjects.length === 0">No species yet. Add your first one!</p>

    <SubjectTable
      v-else
      :subjects="subjects"
      @edit="startEdit"
      @delete="handleDelete"
    />

  </main>
</template>