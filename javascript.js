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

let num1, num2, op;