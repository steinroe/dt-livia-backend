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

const oCollectionRef = firestore.collection('institutions')
const aCats = []
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

    aCats.push(oData['Category'])

    const oDoc = {
        category: oData['Category'],
        description: oData['Short Description'],
        keywords: aKeywords,
        name: oData['Institution/Organization Name'],
        url: oData['Link']
    }

    return await oCollectionRef.add(oDoc)
})

Array.prototype.unique = function() {
    let a = this.concat()
    for(let i=0; i<a.length; ++i) {
        for(let j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1)
        }
    }
    return a
}

Promise.all(aUploading)
.then(aResult => {
    console.log('Done Institutions')
    const aUploadingCats = aCats.unique().map(async sCat => {
        const oDoc = {
            name: sCat
        }
        return await firestore.collection('categories').add(oDoc)
    })
    Promise.all(aUploadingCats)
    .then(aResult => {
        console.log('Done Categories')
    })
})
.catch(err => {
    console.error(err)
})
