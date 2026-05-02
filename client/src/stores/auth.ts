import { defineStore } from 'pinia'
import {
  toRefs,
  reactive
} from 'vue'

const useAuthStore = defineStore('auth', () => {
  const state = reactive({})

  return {
    ...toRefs(state)
  }
})

export default useAuthStore
