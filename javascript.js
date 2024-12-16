function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a -b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if (b == 0) return "infinity";
    return a / b;
}

//performs the operation op on num1 and num2, if it is a valid operation
function operate(num1, op, num2){
    if (op == "+"){
        return(add(num1, num2));
    }
    else if(op == "-"){
        return subtract(num1, num2);
    }
    else if(op == "×"){
        return multiply(num1, num2);
    }
    else if(op == "÷"){
        return divide(num1, num2);
    }
    else{
        return "Invalid Operator";
    }
}

//takes the input val and alters the displayVal accordingly
function addValToDisplay(displayVal, val){
    let lastChar = displayVal[displayVal.length - 1];

    switch(val){
        case "AC":
            //clears and resets displayVal to its default value ("0")
            displayVal = "0";
            break;
        
        case "C":
            //deletes the last character in the displayVal
            displayVal = displayVal.slice(0, displayVal.length - 1);
            //Resets displayVal to its default value ("0") if it ends up being empty
            if(displayVal === "") displayVal = "0";
            break;

        case "%":
            if(lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
                //Replaces last input with "%" if it was an operator
                displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
            }
            else {
                //Adds "%" to displayVal otherwise
                displayVal = displayVal.concat(val);
            }
            break;

        case "÷":
        case "×":
        case "+":
            if(lastChar === "-"){
                let secondLastChar = displayVal[displayVal.length - 2];

                if(secondLastChar === "÷" || secondLastChar === "×"){
                    //Replaces last two inputs with the operator in val if they were a "÷" or "×" followed by a "-"
                    displayVal = displayVal.slice(0, displayVal.length - 2).concat(val);
                }
                else{
                    //Replaces the last input with the operator in val if it was "-" following a number or percentage
                    displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
                }
            }
            else if(lastChar === "÷" || lastChar === "×" || lastChar === "+"){
                //Replaces the last input with the operator in val if it was any other operator
                displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
            }
            else{
                //Adds the operator in val to the displayVal otherwise
                displayVal = displayVal.concat(val);
            }
            break;

        case "-":
            if(lastChar === "+"){
                //Replaces the last input with "-" if it was a "+"
                displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
            }
            else if(lastChar !== "-"){
                //Adds "-" to displayVal if the last input was not "+" or "-"
                displayVal = displayVal.concat(val);
            }
            break;

        case ".":
            if(lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
                //Adds a new number starting with "0." if the last input was an operator
                displayVal = displayVal.concat("0.");
            }
            else if(!isNaN(lastChar)){
                let lastNum = findLastNum(displayVal);
                //Adds "." to displayVal if the last input was part of a number that didn't have "." already
                if(!lastNum.includes(".")){
                    displayVal = displayVal.concat(val);
                }
            }
            break;

        case "=":
            //evaluates the expression in the displayVal and updates displayVal with the result
            displayVal = evaluate(displayVal);
            break;

        default:
            //Adds val to displayVal otherwise
            displayVal = displayVal.concat(val);
    }
    
    return displayVal;
}

//determines and returns the last full number in str (no operators)
function findLastNum(str){
    let s = "";
    for(let i = str.length - 1; i >= 0; i--){
        if(!isNaN(str[i]) || str[i] === "."){
            s = s.concat(str[i]);
        }
        else{break;}
    }
    return s;
}

//evaluates the expression in val
function evaluate(val){
    let arr = val.split("");

    //deletes the trailing operators
    while(isNaN(arr[arr.length - 1]) && arr[arr.length - 1] !== "%"){
        arr = arr.slice(0, arr.length - 1);
    }

    //repeatedly execute the operators within the array until the array forms one number (no operators)
    while(isNaN(arr)){
        let num1 = "", op = "", num2 = "";

        let i = 0;

        while(!isNaN(arr[i])){
            num1 += arr[i];
            i++;
            //console.log(num1);
        }
        if(arr[i] === "%"){
            num1 += arr[i];
            i++;
        }

        op = arr[i];
        i++;

        while(!isNaN(arr[i]) && i < arr.length){
            num2 += arr[i];
            i++;
        }
        if(i < arr.length && arr[i] === "%"){
            num2 += arr[i];
            i++;
        }

        result = operate(parseInt(num1), op, parseInt(num2));

        arr = [result] + arr.slice(i);

        // console.log(num1);
        // console.log(op);
        // console.log(num2);
    }

    return arr;

    //must still evaluate % and tell program to multiply numbers after %
}

let displayVal = "";

let display = document.querySelector("#display");
let buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        displayVal = addValToDisplay(displayVal, button.textContent);
        display.textContent = displayVal;
    });
});