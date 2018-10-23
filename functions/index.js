const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stringSimilarity = require('string-similarity')

admin.initializeApp()

const firestore = admin.firestore()
firestore.settings({timestampsInSnapshots: true})

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

exports.enhanceNotesWithLinks = functions.firestore
    .document('/users/{userId}/activities/{activityId}')
    .onCreate(async (oSnap, oContext) => {
        const oNewActivity = oSnap.data()

        // Only care about notes
        if (oNewActivity.type !== 'note')
            return

        // Get medical information
        const oSnapshot = await firestore.collection('medicalInformation').get()
        const aMedInfoDocs = oSnapshot.docs

        // Get keywords from textual content
        const sTitle = oNewActivity.title
        const aTitle = sTitle.split(' ')
        const sContent = oNewActivity.content
        const aContent = sContent.split(' ')
        const aWords = aTitle.concat(aContent).map(oWord => { return oWord.toLowerCase() })

        const aRelevantInfoIds = aWords.reduce((prev, sWord, index, array) => {
            const aRelevantMedInfoDocs = aMedInfoDocs.filter(oDoc => {
                return oDoc.data().keywords.find(sKeyword => {
                    return stringSimilarity.compareTwoStrings(sKeyword, sWord) > 0.6
                })
            })
            
            const aInfoIds = aRelevantMedInfoDocs.map(oDoc => {
                return oDoc.id
            })
            return [...prev, ...aInfoIds].unique()
        }, [])
        
        const aRefs = aRelevantInfoIds.map(oInfoId => {
            return firestore.doc('/medicalInformation/' + oInfoId)
        })
        oNewActivity['relevantInfos'] = aRefs
        return firestore.collection('users').doc(oContext.params.userId).collection('activities').doc(oContext.params.activityId).set(oNewActivity)
    })
