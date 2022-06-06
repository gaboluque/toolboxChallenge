const express = require('express')
const router = express.Router()
const { getFiles, getFile } = require('../apis/tbxNet')

// Format data from each file response by _manually_ parsing csv
const formatFilesData = (filesData) => {
  return filesData.map((fileData) => {
    let parsed = fileData?.split('\n')
    parsed?.splice(0, 1)
    parsed = parsed?.reduce((fileArr, curr) => {
      const d = curr.split(',')
      if (d[0] && d[1] && d[2] && d[3]) fileArr.push({ name: d[0], text: d[1], number: d[2], hex: d[3] })
      return fileArr
    }, [])

    // Return parsed data if it has any content, or undefined for filtering
    return parsed?.length ? parsed : undefined
  }).filter(Boolean).reduce((a, c) => [...a, ...c], [])
}

/* GET files data. */
router.get('/data', async function (req, res, next) {
  try {
    const { fileName: qFileName } = req.query
    console.log(qFileName)

    const files = await getFiles()

    // Create an array with all the requests to get the files data
    const filesGetter = files.map(async (fileName) => getFile(fileName))

    // Request all the files data and filter successful requests
    const filesData = await Promise.allSettled(filesGetter).then((responses) =>
      responses
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
    )

    // Format data from each file response by _manually_ parsing csv
    let formattedData = formatFilesData(filesData)

    if (qFileName) {
      formattedData = formattedData.filter((f) => f.name.includes(qFileName))
    }

    res.status(200).send({ data: formattedData })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

/* GET files list. */
router.get('/list', async function (req, res, next) {
  try {
    const files = await getFiles()

    res.status(200).send({ data: files })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

module.exports = router
