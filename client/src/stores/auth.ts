import useHttp from '@/composables/useHttp.ts'
import {
  defineStore
} from 'pinia'
import {
  toRefs,
  reactive
} from 'vue'

const useAuthStore = defineStore('auth', () => {
  const http = useHttp()

  const state = reactive({})

  return {
    ...toRefs(state),

    http
  }
})

export default useAuthStore
