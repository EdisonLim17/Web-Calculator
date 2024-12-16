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

function operate(num1, op, num2){
    if (op == "+"){
        return(add(num1, num2));
    }
    else if(op == "-"){
        return subtract(num1, num2);
    }
    else if(op == "*"){
        return multiply(num1, num2);
    }
    else if(op == "/"){
        return divide(num1, num2);
    }
    else{
        return "Invalid Operator";
    }
}

function addValToDisplay(displayVal, val){
    let lastChar = displayVal[displayVal.length - 1];
    if(val === "AC"){
        displayVal = "";
    }
    else if(val === "C"){
        displayVal = displayVal.slice(0, displayVal.length - 1);
    }
    else if(val === "%"){
        if(lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
            displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
        }
        else {
            displayVal = displayVal.concat(val);
        }
    }
    else if(val === "÷" || val === "×" || val === "+"){
        if(lastChar === "-"){
            let secondLastChar = displayVal[displayVal.length - 2];
            if(secondLastChar === "÷" || secondLastChar === "×"){
                displayVal = displayVal.slice(0, displayVal.length - 2).concat(val);
            }
            else{
                displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
            }
        }
        else if(lastChar === "÷" || lastChar === "×" || lastChar === "+"){
            displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
        }
        else{
            displayVal = displayVal.concat(val);
        }
    }
    else if(val === "-"){
        if(lastChar === "+"){
            displayVal = displayVal.slice(0, displayVal.length - 1).concat(val);
        }
        else if(!(lastChar === "-")){
            displayVal = displayVal.concat(val);
        }
    }
    else if(val === "."){
        if(lastChar === "÷" || lastChar === "×" || lastChar == "-" || lastChar === "+"){
            displayVal = displayVal.concat("0.");
        }
        else if(!isNaN(lastChar)){
            let lastNum = findLastNum(displayVal);
            if(!lastNum.includes(".")){
                displayVal = displayVal.concat(val);
            }
        }
    }
    else{
        displayVal = displayVal.concat(val);
    }
    
    return displayVal;
}

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

let num1, num2, op;
let displayVal = "";

let display = document.querySelector("#display");
let buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        displayVal = addValToDisplay(displayVal, button.textContent);
        display.textContent = displayVal;
    });
});