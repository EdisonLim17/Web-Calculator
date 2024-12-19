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

//takes the input val and alters the currDisplayVal accordingly
function addValToDisplay(currDisplayVal, val){
    let lastChar = currDisplayVal[currDisplayVal.length - 1];
    let secondLastChar = currDisplayVal[currDisplayVal.length - 2];
    let thirdLastChar = currDisplayVal[currDisplayVal.length - 3];

    if(currDisplayVal === "infinity") {currDisplayVal = "0";}

    switch(val){
        case "AC":
            //clears and resets currDisplayVal to its default value ("0")
            currDisplayVal = "0";
            break;
        
        case "C":
            //deletes the last character in the currDisplayVal
            currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1);
            //Resets currDisplayVal to its default value ("0") if it ends up being empty
            if(currDisplayVal === "") currDisplayVal = "0";
            break;

        case "%":
            if(lastChar === "%" || lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
                //Replaces last input(s) with "%" if they were operators or "%"
                if(secondLastChar === "%" || secondLastChar === "÷" || secondLastChar === "×"){
                    if(thirdLastChar === "%"){
                        currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 3).concat(val);
                    }
                    else{
                        currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 2).concat(val);
                    }
                }
                else{
                    currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1).concat(val);
                }
            }
            else {
                //Adds "%" to currDisplayVal otherwise
                currDisplayVal = currDisplayVal.concat(val);
            }
            break;

        case "÷":
        case "×":
        case "+":
            if(lastChar === "-"){
                if(secondLastChar === "÷" || secondLastChar === "×"){
                    //Replaces last two inputs with the operator in val if they were a "÷" or "×" followed by a "-"
                    currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 2).concat(val);
                }
                else{
                    //Replaces the last input with the operator in val if it was "-" following a number or percentage
                    currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1).concat(val);
                }
            }
            else if(lastChar === "÷" || lastChar === "×" || lastChar === "+"){
                //Replaces the last input with the operator in val if it was any other operator
                currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1).concat(val);
            }
            else{
                //Adds the operator in val to the currDisplayVal otherwise
                currDisplayVal = currDisplayVal.concat(val);
            }
            break;

        case "-":
            if(lastChar === "+"){
                //Replaces the last input with "-" if it was a "+"
                currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1).concat(val);
            }
            else if(lastChar !== "-"){
                //Adds "-" to currDisplayVal if the last input was not "+" or "-"
                currDisplayVal = currDisplayVal.concat(val);
            }
            break;

        case ".":
            if(lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
                //Adds a new number starting with "0." if the last input was an operator
                currDisplayVal = currDisplayVal.concat("0.");
            }
            else if(!isNaN(lastChar)){
                let lastNum = findLastNum(currDisplayVal);
                //Adds "." to currDisplayVal if the last input was part of a number that didn't have "." already
                if(!lastNum.includes(".")){
                    currDisplayVal = currDisplayVal.concat(val);
                }
            }
            break;

        case "=":
            //evaluates the expression in the currDisplayVal and updates currDisplayVal with the result
            currDisplayVal = evaluate(currDisplayVal).join("");
            break;

        default:
            //Adds val to currDisplayVal otherwise, it the last input wasn't "%"
            if(lastChar !== "%"){
                if(findLastNum(currDisplayVal) === "0"){
                    //Replace leading 0 with the number if it isn't "0"
                    if(val !== "0") currDisplayVal = currDisplayVal.slice(0, currDisplayVal.length - 1).concat(val);
                }
                //Add number to currDisplayVal otherwise
                else currDisplayVal = currDisplayVal.concat(val);
            }
    }
    
    return currDisplayVal;
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

let currDisplayVal = "0";

let currDisplay = document.querySelector("#currDisplay");
currDisplay.textContent = currDisplayVal;

let buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        currDisplayVal = addValToDisplay(currDisplayVal, button.textContent);
        currDisplay.textContent = currDisplayVal;
    });
});

document.addEventListener("keydown", (e) => {
    if(!isNaN(e.key)) {
        currDisplayVal = addValToDisplay(currDisplayVal, e.key);
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === ".") {
        currDisplayVal = addValToDisplay(currDisplayVal, ".");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "%") {
        currDisplayVal = addValToDisplay(currDisplayVal, "%");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "/") {
        currDisplayVal = addValToDisplay(currDisplayVal, "÷");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "*") {
        currDisplayVal = addValToDisplay(currDisplayVal, "×");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "-") {
        currDisplayVal = addValToDisplay(currDisplayVal, "-");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "+") {
        currDisplayVal = addValToDisplay(currDisplayVal, "+");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "Enter") {
        currDisplayVal = addValToDisplay(currDisplayVal, "=");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "Backspace") {
        currDisplayVal = addValToDisplay(currDisplayVal, "C");
        currDisplay.textContent = currDisplayVal;
    }
    else if(e.key === "Escape") {
        currDisplayVal = addValToDisplay(currDisplayVal, "AC");
        currDisplay.textContent = currDisplayVal;
    }
});