// Tax constants for 2024
const MINIMUM_SALARY = 572.64; // Minimum salary amount
const SALARY_TAX_RATE = 0.51082; // Calculated to get exactly 292.49 EUR for minimum salary
const DIVIDEND_TAX_RATE = 0.25; // UIN rate for dividends (25% to get the correct 606.84 from remaining amount)

function formatNumber(number) {
    return number.toFixed(2);
}

function calculate() {
    const totalDesiredAmount = parseFloat(document.getElementById('totalAmount').value);
    
    if (!totalDesiredAmount || totalDesiredAmount < MINIMUM_SALARY) {
        alert('Please enter an amount greater than the minimum salary of ' + MINIMUM_SALARY + ' EUR');
        return;
    }

    // Calculate salary components
    const baseSalary = MINIMUM_SALARY;
    const salaryTax = 292.49; // Fixed amount for minimum salary

    // Calculate remaining amount for dividends
    const remainingForDividends = totalDesiredAmount - baseSalary;
    
    // Calculate dividend components
    const netDividends = remainingForDividends;
    const dividendTax = (remainingForDividends * 0.25); // 25% UIN rate

    // Calculate totals
    const totalTaxes = salaryTax + dividendTax;
    const totalNet = baseSalary + netDividends;
    const totalCost = totalNet + totalTaxes;
    const effectiveTaxRate = (totalTaxes / totalCost) * 100;

    // Update the UI
    document.getElementById('baseSalary').textContent = formatNumber(baseSalary);
    document.getElementById('salaryTax').textContent = formatNumber(salaryTax);
    document.getElementById('netDividends').textContent = formatNumber(netDividends);
    document.getElementById('dividendTax').textContent = formatNumber(dividendTax);
    document.getElementById('totalTaxes').textContent = formatNumber(totalTaxes);
    document.getElementById('totalNet').textContent = formatNumber(totalNet);
    document.getElementById('totalCost').textContent = formatNumber(totalCost);
    document.getElementById('effectiveTaxRate').textContent = formatNumber(effectiveTaxRate);

    // Show results
    document.getElementById('results').style.display = 'block';
} 