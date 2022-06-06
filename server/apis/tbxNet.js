const axios = require('axios')
const { tbxNetKey } = require('../config')

const tbxAxios = axios.create({
  baseURL: 'https://echo-serv.tbxnet.com/v1/',
  headers: {
    authorization: `Bearer ${tbxNetKey}`
  }
})

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  return Promise.reject(error)
})

const getFiles = async () => {
  const data = await tbxAxios.get('/secret/files')

  if (data.status !== 200) throw new Error('Error fetching files')

  return data.data.files
}

const getFile = async (fileName) => {
  const data = await tbxAxios.get(`/secret/file/${fileName}`)

  if (data.status !== 200) throw new Error('Error fetching file')

  return data.data
}

module.exports = {
  getFiles,
  getFile
}
