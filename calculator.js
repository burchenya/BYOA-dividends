// Tax constants for 2024
const DIVIDEND_TAX_RATE = 0.25; // UIN rate for dividends

let breakdownChart = null;

function formatNumber(number) {
    return number.toFixed(2);
}

function formatCurrency(number) {
    return formatNumber(number) + ' €';
}

function initChart() {
    const ctx = document.getElementById('breakdownChart').getContext('2d');

    // Create pattern for salary tax
    const salaryTaxPattern = document.createElement('canvas');
    salaryTaxPattern.width = 6;
    salaryTaxPattern.height = 6;
    const stCtx = salaryTaxPattern.getContext('2d');
    stCtx.strokeStyle = '#fbbf24';
    stCtx.lineWidth = 2;
    stCtx.beginPath();
    stCtx.moveTo(0, 0);
    stCtx.lineTo(6, 6);
    stCtx.stroke();

    // Create pattern for dividend tax
    const dividendTaxPattern = document.createElement('canvas');
    dividendTaxPattern.width = 6;
    dividendTaxPattern.height = 6;
    const dtCtx = dividendTaxPattern.getContext('2d');
    dtCtx.strokeStyle = '#3b82f6';
    dtCtx.lineWidth = 2;
    dtCtx.beginPath();
    dtCtx.moveTo(0, 0);
    dtCtx.lineTo(6, 6);
    dtCtx.stroke();

    if (breakdownChart) {
        breakdownChart.destroy();
    }

    breakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Base Salary', 'Net Dividends', 'Salary Tax', 'Dividend Tax'],
            datasets: [{
                data: [25, 25, 25, 25], // Equal parts for initial state
                backgroundColor: [
                    '#fbbf24', // Base Salary - solid yellow
                    '#3b82f6', // Net Dividends - solid blue
                    ctx.createPattern(salaryTaxPattern, 'repeat'), // Salary Tax - striped yellow
                    ctx.createPattern(dividendTaxPattern, 'repeat')  // Dividend Tax - striped blue
                ],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false // Disable tooltips in initial state
                }
            }
        }
    });
}

function updateChart(baseSalary, netDividends, salaryTax, dividendTax) {
    if (!breakdownChart) {
        initChart();
    }
    breakdownChart.data.datasets[0].data = [baseSalary, netDividends, salaryTax, dividendTax];
    // Enable tooltips when actual data is shown
    breakdownChart.options.plugins.tooltip = {
        enabled: true,
        callbacks: {
            label: function(context) {
                return context.label + ': ' + formatCurrency(context.raw);
            }
        }
    };
    breakdownChart.update();
}

function calculate() {
    console.log('Calculate function called'); // Debug log

    // Get input values and replace any commas with periods
    const totalDesiredAmount = parseFloat(document.getElementById('totalAmount').value.replace(',', '.')) || 0;
    const baseSalary = parseFloat(document.getElementById('baseSalaryInput').value.replace(',', '.')) || 0;
    const salaryTax = parseFloat(document.getElementById('salaryTaxInput').value.replace(',', '.')) || 0;
    
    console.log('Inputs:', { totalDesiredAmount, baseSalary, salaryTax }); // Debug log

    if (!totalDesiredAmount || !baseSalary || !salaryTax) {
        alert('Please fill in all fields');
        return;
    }

    if (totalDesiredAmount < baseSalary) {
        alert('Total desired amount must be greater than your salary');
        return;
    }

    // Calculate remaining amount for dividends
    const remainingForDividends = totalDesiredAmount - baseSalary;
    
    // Calculate dividend components
    const netDividends = remainingForDividends;
    const dividendTax = (remainingForDividends * DIVIDEND_TAX_RATE);

    // Calculate totals
    const totalTaxes = salaryTax + dividendTax;
    const totalNet = baseSalary + netDividends;
    const totalCost = totalNet + totalTaxes;
    const effectiveTaxRate = (totalTaxes / totalCost) * 100;

    console.log('Calculations:', { 
        netDividends, 
        dividendTax, 
        totalTaxes, 
        totalNet, 
        totalCost, 
        effectiveTaxRate 
    }); // Debug log

    try {
        // Update the UI
        document.getElementById('baseSalaryDisplay').textContent = formatCurrency(baseSalary);
        document.getElementById('salaryTaxDisplay').textContent = formatCurrency(salaryTax);
        document.getElementById('netDividendsDisplay').textContent = formatCurrency(netDividends);
        document.getElementById('dividendTaxDisplay').textContent = formatCurrency(dividendTax);
        document.getElementById('totalCost').textContent = formatCurrency(totalCost);
        document.getElementById('totalTaxes').textContent = formatCurrency(totalTaxes);
        document.getElementById('totalNet').textContent = formatCurrency(totalNet);
        document.getElementById('effectiveTaxRate').textContent = formatNumber(effectiveTaxRate) + '%';
        document.getElementById('desiredAmount').textContent = formatNumber(totalDesiredAmount);

        // Update the chart with actual values
        updateChart(baseSalary, netDividends, salaryTax, dividendTax);

        // Show results
        const resultsSection = document.getElementById('results');
        const youWillGet = document.getElementById('you-will-get');
        
        if (resultsSection) resultsSection.style.display = 'block';
        if (youWillGet) youWillGet.style.display = 'block';

        console.log('UI updated successfully'); // Debug log
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded'); // Debug log
    
    try {
        initChart();
        
        // Hide results sections initially
        const resultsSection = document.getElementById('results');
        const youWillGet = document.getElementById('you-will-get');
        
        if (resultsSection) resultsSection.style.display = 'none';
        if (youWillGet) youWillGet.style.display = 'none';

        // Add click event listener to calculate button
        const calculateButton = document.querySelector('button');
        if (calculateButton) {
            calculateButton.addEventListener('click', calculate);
        }

        // Add tab key listeners for placeholder values
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                // Check if the key pressed is Tab and the field is empty
                if (e.key === 'Tab' && !this.value && this.placeholder) {
                    this.value = this.placeholder;
                }
            });
        });

        console.log('Initialization complete'); // Debug log
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}); 