import { DecisionTree } from "./libraries/decisiontree.js"

function loadSavedModel() {
    fetch("model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))

}

function modelLoaded(model) {
    let decisionTree = new DecisionTree(model);
    let predictButton = document.getElementById('predictButton');

    predictButton.addEventListener('click', () => formHandler(decisionTree));
}

function formHandler(decisionTree){
    let predict = document.getElementById('predict');

    //waarden ophalen uit de form
    let glucose = document.getElementById('glucose');
    let age = document.getElementById('age');
    let bmi = document.getElementById('bmi');


    let testPerson = { Glucose: glucose.value, Age: age.value, bmi: bmi.value }
    let prediction = decisionTree.predict(testPerson);

    if(prediction == 1){
        predict.innerHTML = 'U hebt diabetes';
    } else if(prediction == 0){
        predict.innerHTML = 'U hebt geen diabetes';
    } else{
        predict.innerHTML = 'Sorry het testen is mislukt'
    }

    console.log("predicted " + prediction);
}

loadSavedModel()