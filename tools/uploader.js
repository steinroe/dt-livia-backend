const Firestore = require('@google-cloud/firestore')
const XLSX = require('xlsx')

const firestore = new Firestore({
  projectId: 'dt-livia',
  keyFilename: 'dt-livia-3b731322c466.json',
})

const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

const oWorkbook = XLSX.readFile('resources.xlsx', {})
const oSheet = oWorkbook.Sheets[oWorkbook.SheetNames[0]]
const aData = XLSX.utils.sheet_to_json(oSheet)

const oCollectionRef = firestore.collection('medicalInformation')
const aUploading = aData.map(async oData => {
    const aRawKeywords = oData['Keywords'].split(';')
    const aKeywords = aRawKeywords.reduce((prev, curr, ind, arr) => {
        let sKeyword = curr.replace(/ /g,'')
                            .toLowerCase()
        if (sKeyword != '') {
            prev.push(sKeyword)
        }
        return prev
    }, [])
    const sId = oData['Institution/Organization Name']
        .trim()
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/&/g, 'and')
        .replace(/.org/g, '-org')
        .replace(/u.s./g, 'us')
    const oDoc = {
        category: oData['Category'],
        description: oData['Short Description'],
        keywords: aKeywords,
        name: oData['Institution/Organization Name'],
        url: oData['Link']
    }
    return await oCollectionRef.doc(sId).set(oDoc)
})
Promise.all(aUploading)
.then(aResult => {
    console.log('Done')
})