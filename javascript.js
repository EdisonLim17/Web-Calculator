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
        //is this possible?
        return "Invalid Operator";
    }
}

//takes the input val and alters the displayVal accordingly
function addValToDisplay(displayVal, val){
    let lastChar = displayVal[displayVal.length - 1];
    let secondLastChar = displayVal[displayVal.length - 2];
    let thirdLastChar = displayVal[displayVal.length - 3];

    if(displayVal === "infinity") {displayVal = "0";}

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
            if(lastChar === "%" || lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
                //Replaces last input(s) with "%" if they were operators or "%"
                if(secondLastChar === "%" || secondLastChar === "÷" || secondLastChar === "×"){
                    if(thirdLastChar === "%"){
                        displayVal = displayVal.slice(0, displayVal.length - 3).concat(val);
                    }
                    else{
                        displayVal = displayVal.slice(0, displayVal.length - 2).concat(val);
                    }
                }
                else{
                    displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
                }
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
            displayVal = evaluate(displayVal).join("");
            break;

        default:
            //Adds val to displayVal otherwise, it the last input wasn't "%"
            if(lastChar !== "%"){
                if(findLastNum(displayVal) === "0"){
                    //Replace leading 0 with the number if it isn't "0"
                    if(val !== "0") displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
                }
                //Add number to displayVal otherwise
                else displayVal = displayVal.concat(val);
            }
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
    while(isNaN(arr.join(""))){
        let num1 = "", op = "", num2 = "";
        let num1Length = 0, num2Length = 0;

        let i = 0;
        
        //creates a string from arr representing the first number of the operation
        while(!isNaN(arr[i]) || arr[i] === "." || arr[i] === "-"){
            if(arr[i] === "-"){
                if(num1 !== ""){
                    break;
                }
            }
            num1 += arr[i];
            num1Length++;
            i++;
        }
        if(arr[i] === "%"){
            num1 = (parseFloat(num1) / 100).toString();
            num1Length++;
            i++;
        }

        //if the array consists of a single percentage, return the evaluated percentage
        if(i === arr.length) {
            //round result to 14 digits so that it doesn't overflow the display
            if(num1.length > 14){
                let numRoundedIntegerLength = Math.round(parseFloat(num1)).toString().length;
                if(numRoundedIntegerLength >= 14){
                    num1 = Math.round(parseFloat(num1));
                }
                else{
                    num1 = parseFloat(num1).toFixed(14 - numRoundedIntegerLength);
                }
            }
            arr = num1.toString().split("");
            break;
        }
        
        //creates a string from arr representing the operator of the operation
        op = arr[i];
        i++;

        //creates a string arr representing the second number of the operation
        while(i < arr.length && (!isNaN(arr[i]) || arr[i] === "." || arr[i] === "-")){
            if(arr[i] === "-"){
                if(num2 !== ""){
                    break;
                }
            }
            num2 += arr[i];
            num2Length++;
            i++;
        }
        if(i < arr.length && arr[i] === "%"){
            num2 = (parseFloat(num2) / 100).toString();
            num2Length++;
            i++;
        }

        //evaluates the operation and stores the result
        let result = operate(parseFloat(num1), op, parseFloat(num2));
        if(result === "infinity"){
            arr = result.split("");
            break;
        }

        //replaces the first expression in the array to the evaluated result
        arr.splice(0, num1Length + num2Length + 1);
        
        //rounds result if it is a decimal so that the decimal doesn't overflow the display
        if(result.toString().length > 14){
            numRoundedIntegerLength = Math.round(result).toString().length;
            if(numRoundedIntegerLength >= 14){
                result = Math.round(result);
            }
            else{
                result = result.toFixed(14 - numRoundedIntegerLength);
            }
        }
        
        arr = result.toString().split("").concat(arr);
    }

    return arr;
}

let displayVal = "0";

let display = document.querySelector("#display");
display.textContent = displayVal;

let buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        displayVal = addValToDisplay(displayVal, button.textContent);
        display.textContent = displayVal;
    });
});

document.addEventListener("keydown", (e) => {
    if(!isNaN(e.key)) {
        displayVal = addValToDisplay(displayVal, e.key);
        display.textContent = displayVal;
    }
    else if(e.key === ".") {
        displayVal = addValToDisplay(displayVal, ".");
        display.textContent = displayVal;
    }
    else if(e.key === "%") {
        displayVal = addValToDisplay(displayVal, "%");
        display.textContent = displayVal;
    }
    else if(e.key === "/") {
        displayVal = addValToDisplay(displayVal, "÷");
        display.textContent = displayVal;
    }
    else if(e.key === "*") {
        displayVal = addValToDisplay(displayVal, "×");
        display.textContent = displayVal;
    }
    else if(e.key === "-") {
        displayVal = addValToDisplay(displayVal, "-");
        display.textContent = displayVal;
    }
    else if(e.key === "+") {
        displayVal = addValToDisplay(displayVal, "+");
        display.textContent = displayVal;
    }
    else if(e.key === "Enter") {
        displayVal = addValToDisplay(displayVal, "=");
        display.textContent = displayVal;
    }
    else if(e.key === "Backspace") {
        displayVal = addValToDisplay(displayVal, "C");
        display.textContent = displayVal;
    }
    else if(e.key === "Escape") {
        displayVal = addValToDisplay(displayVal, "AC");
        display.textContent = displayVal;
    }
});