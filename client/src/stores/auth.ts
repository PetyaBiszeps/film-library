// import useAPI from '@/composables/useAPI.ts'
import { defineStore } from 'pinia'
import {
  toRefs,
  reactive
} from 'vue'

const useAuthStore = defineStore('auth', () => {
  // const http = useAPI()

  const state = reactive({})

  return {
    ...toRefs(state)
  }
})

export default useAuthStore
