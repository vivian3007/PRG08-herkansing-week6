import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "data/diabetes.csv"
const trainingLabel = "Label"
const ignored = ["Label"]

//define variables
let actualDiabetic = 0;
let actualHealthy = 0;
let predictedDiabetic = 0;
let predictedHealthy = 0;

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    //data door elkaar husselen
    data.sort(() => (Math.random() - 0.5));

    //splitsen in test en traindata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    // Save the model with click event
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        saveModel(decisionTree);
    });

    // todo : maak een prediction met een sample uit de testdata
    //prediction
    let diabetes = testData[0]
    let diabetesPrediction = decisionTree.predict(diabetes)

    if(diabetesPrediction == 0){
        console.log('Diabetes : No');
    } else{
        console.log('Diabetes : Yes');
    }



    // todo : bereken de accuracy met behulp van alle test data
    //accuracy
    function accuracy(data, tree, kind){
        let correct = 0;
        for(let row of data){
            if (row.Label == tree.predict(row)){
                correct++
            }
        }

        console.log(`Accuracy ${kind} data: ${correct / data.length}`)

        //show accuracy in html
        let accuracyValue = document.getElementById('accuracy');
        accuracyValue.innerText = `Accuracy: ${correct / data.length}`;
    }

    accuracy(trainData, decisionTree, "train");
    accuracy(testData, decisionTree, "test");

    //confusion matrix input
    for(const row of data){
        if(row.Label == 0 && decisionTree.predict(row) == 0) {
            actualHealthy++
        }
        else if (row.Label == 1 && decisionTree.predict(row) == 0) {
            predictedHealthy++
        }
        else if (row.Label == 0 && decisionTree.predict(row) == 1){
            predictedDiabetic++
        }
        else if (row.Label == 1 && decisionTree.predict(row) == 1){
            actualDiabetic++
        }
    }

    //confusion matrix
    let tableActualHealthy = document.getElementById('actualHealthy');
    tableActualHealthy.innerText = actualHealthy.toString();

    let tablePredictedDiabetic = document.getElementById('predictedDiabetic');
    tablePredictedDiabetic.innerText = predictedDiabetic.toString();

    let tablePredictedHealthy = document.getElementById('predictedHealthy');
    tablePredictedHealthy.innerText = predictedHealthy.toString();

    let tableActualDiabetic = document.getElementById('actualDiabetic');
    tableActualDiabetic.innerText = actualDiabetic.toString();

}

// Save the decision tree model to a JSON file
function saveModel(decisionTree) {
    let json = decisionTree.stringify()
    console.log(json)
}




loadData()