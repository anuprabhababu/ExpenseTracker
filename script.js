const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const chartCanvas = document.getElementById('expense-chart');
let chart;

// Load existing data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ₹${exp.amount} - ${exp.category} (${exp.date})<br><small>${exp.note}</small>
      <button onclick="deleteExpense(${index})">❌</button>
    `;
    expenseList.appendChild(li);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
  updateChart();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value.trim();
  const note = document.getElementById('note').value.trim();
  const date = document.getElementById('date').value;

  if (!amount || !category || !date) return;

  expenses.push({ amount, category, note, date });
  saveExpenses();
  renderExpenses();
  updateChart();
  form.reset();
});

// Chart
function updateChart() {
  const categoryTotals = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'
      ],
    }]
  };

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: data,
    options: {
      responsive: true
    }
  });
}

// Initial Load
renderExpenses();
updateChart();
