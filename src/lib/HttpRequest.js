import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:4500'
})

export default instance
