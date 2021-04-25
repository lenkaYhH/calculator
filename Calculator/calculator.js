//+brackets

const displayText = document.getElementById('displayText');
const numBtnEls = document.getElementsByClassName('number');
const operatorsBtnEls = document.getElementsByClassName('operator');
const bracketsBtnEls = document.getElementsByClassName('brackets');
const clearBtn = document.getElementById('clear');
const equalBtn = document.getElementById('enter');


let display = '';
let calculationArray = [];

let bracketsLocation = [];
let bracketsNumber = 0;

let numberEntered = '';
let numberList = [];
let operatorList = [];

let answer;

function clear() {
    calculationArray = [];
    bracketsLocation = [];
    display = '';
    numberEntered = '';
    numberList = [];
    operatorList = [];
    answer = 0;
}

function err() {
    clear();
    displayText.textContent = 'Error';
}

for (i = 0; i < numBtnEls.length; i++) {
    numBtnEls[i].addEventListener('click', btnOnClick);
}

for (i = 0; i < operatorsBtnEls.length; i++) {
    operatorsBtnEls[i].addEventListener('click', btnOnClick);
}

for (i = 0; i < bracketsBtnEls.length; i++) {
    bracketsBtnEls[i].addEventListener('click', bracketsOnClick);
}

function bracketsOnClick(e) {
    calculationArray.push(e.target.id);
    display += e.target.id;

    if (e.target.id === '(') {
        bracketsLocation.push([numberList.length, 0]);
        bracketsNumber++;
    } else {
        for (i = 0; i < bracketsLocation.length; i++) {
            if (bracketsLocation[i][1] === 0) {
                bracketsLocation[i][1] = numberList.length +1;
                break;
            }
        }
        bracketsNumber--; 
    }
    
    console.log(`current brackets location: ${bracketsLocation}`);
    displayText.textContent = display;

}

function btnOnClick(e) {
    display += e.target.id;
    if (e.target.className === 'operator') {
        if (numberEntered.length !== 0) {
            numberList.push(parseFloat(numberEntered, 10));
            calculationArray.push(parseFloat(numberEntered, 10));
            numberEntered = '';
            operatorList.push(e.target.id);
            calculationArray.push(e.target.id);
        } else {
            err();
        }
    } else {
        numberEntered += e.target.id;
    }

    displayText.textContent = display;
}


clearBtn.onclick = function () {
    displayText.textContent = '0';
    clear();
}


function process(operatorList, numberList) {
    
    while (operatorList.includes('^')) {
        let position = operatorList.indexOf('^');
        numberList[position] = Math.pow(numberList[position], numberList[position + 1]);
        numberList.splice(position + 1, 1);
        operatorList.splice(position, 1);
    }

    while (operatorList.includes('x')) {
        let position = operatorList.indexOf('x');
        numberList[position] = numberList[position] * numberList[position + 1];
        numberList.splice(position + 1, 1);
        operatorList.splice(position, 1);
    }

    while (operatorList.includes('÷')) {
        let position = operatorList.indexOf('÷');
        numberList[position] = numberList[position] / numberList[position + 1];
        numberList.splice(position + 1, 1);
        operatorList.splice(position, 1);
    }

    answer = numberList[0];

    while (operatorList.includes('+')) {
        let position = operatorList.indexOf('+');
        numberList[position] = numberList[position] + numberList[position + 1];
        numberList.splice(position + 1, 1);
        operatorList.splice(position, 1);
    }

    while (operatorList.includes('-')) {
        let position = operatorList.indexOf('-');
        numberList[position] = numberList[position] - numberList[position + 1];
        numberList.splice(position + 1, 1);
        operatorList.splice(position, 1);
    }

    answer = numberList[0];
    return answer;
}

equalBtn.onclick = function () {

    if (numberList.length === 0) {
        err();
    } else {

        numberList.push(parseFloat(numberEntered, 10));
        numberEntered = '';

        if (numberList.length - 1 === operatorList.length && bracketsNumber === 0) {
            while (bracketsLocation.length !== 0) {

                let smallestBracket = bracketsLocation[0];
                for (i=0; i<bracketsLocation.length; i++) {
                    
                    let a = bracketsLocation[i][1];
                    let b = bracketsLocation[i][0];
                    let difference = a-b;

                    let c = smallestBracket[1];
                    let d = smallestBracket[0];
                    let smallDifference = c-d;

                    if (difference < smallDifference) {
                        smallestBracket = bracketsLocation[i]
                    }
                }

                
                let priorNumList = numberList.slice(smallestBracket[0], smallestBracket[1] );
                let priorOpList = operatorList.slice(smallestBracket[0], smallestBracket[1] - 1);

                if(priorOpList.includes(0)) {
                    priorOpList.push(operatorList[operatorList.indexOf(0) + 1]);
                    priorOpList.splice(priorOpList.indexOf(0), 1);
                }

                process(priorOpList, priorNumList);
                numberList[smallestBracket[0]] = answer;
                numberList.splice(smallestBracket[0] + 1, smallestBracket[1] - smallestBracket[0] - 1, 0);
                operatorList.splice(smallestBracket[0], smallestBracket[1] - smallestBracket[0] - 1, 0);
                bracketsLocation.shift();
            }

            while (numberList.includes(0)) {
                numberList.splice(numberList.indexOf(0), 1);
            }

            while(operatorList.includes(0)) {
                operatorList.splice(operatorList.indexOf(0), 1)
            }

            process(operatorList, numberList);
            console.log('answer: ' + answer);
            displayText.textContent = answer;
            clear();
        } else {
            err();
        }
    }
}