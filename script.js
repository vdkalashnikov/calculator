const display = document.getElementById('display');
let lastInputWasOperator = false;
let currentInputLength = 0;

// Listen for keydown events on the document
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (isOperator(key) || isDecimal(key) || isDigit(key) || key === 'x' || key === 'm' || key === 'd' || key === 'p' || key === 'a') {
        if (key === 'x') {
            appendToDisplay('*');   
        } else if(key === 'm') {
            appendToDisplay('-');
        } else if(key === 'd'){
            appendToDisplay('/')
        } else if(key === 'p'){
            appendToDisplay('%')
        } else if(key === 'a'){
            appendToDisplay('+');
        }else {
            appendToDisplay(key);
        }
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteFromDisplay();
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'i'){
        calculate()
    }
});


function appendToDisplay(input){
    const lastChar = display.value.slice(-1);

    if (isOperator(input)) {
        if (display.value.length === 0 && input !== '-') {
            return; // Prevent operator input if display is empty, except for minus
        }
        
        if (isOperator(lastChar) && lastChar !== '%') {
            if (lastChar === '-' && isOperator(display.value.slice(-2, -1))) {
                return; // Prevent multiple operators, even if minus is followed by another operator
            }
            if (input === '-') {
                if (lastChar === '-') {
                    return; // Prevent multiple minus operators
                }
            } else {
                return; // Prevent multiple operators
            }
        }

        display.value = formatNumber(display.value.replace(/,/g, '')) + input;
        lastInputWasOperator = true;
        currentInputLength = 0;
    } else {
        if (lastInputWasOperator) {
            currentInputLength = 0;
            lastInputWasOperator = false;
        }
        if (isDecimal(input)) {
            if (currentInputLength < 10) {
                display.value += input;
                currentInputLength++;
            }
        } else {
            if (currentInputLength < 15) {
                display.value += input;
                currentInputLength++;
            }
        }
        display.value = formatNumber(display.value.replace(/,/g, ''));
    }
}

function deleteFromDisplay(){
    if (display.value.length > 0) {
        const lastChar = display.value.slice(-1);
        display.value = display.value.slice(0, -1);
        if (!isOperator(lastChar)) {
            currentInputLength--;
        } else {
            lastInputWasOperator = false;
        }
        display.value = formatNumber(display.value.replace(/,/g, ''));
    }
}

function clearDisplay(){
    display.value = '';
    currentInputLength = 0;
}

function calculate(){
    if (display.value.length === 0) {
        return; // Prevent calculation if display is empty
    }
    try {
        let expression = display.value.replace(/,/g, ''); // Remove commas for evaluation
        // Handle percentage calculation
        expression = expression.replace(/(\d+(\.\d+)?)%/g, (match, p1) => {
            return `(${p1} / 100)`;
        });
        let result = eval(expression);
        if (result.toString().length > 15) {
            result = parseFloat(result.toPrecision(15));
        }
        display.value = result.toString().length > 15 ? result.toExponential(9) : formatNumber(result.toString());
        lastInputWasOperator = false;
        currentInputLength = 0;
    } catch (error) {
        display.value = 'Invalid Format';
    }
}

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function isDecimal(char) {
    return char === '.';
}

function isDigit(char) {
    return char >= '0' && char <= '9';
}

function formatNumber(value) {
    // Remove any existing commas
    value = value.replace(/,/g, '');
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}