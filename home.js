const links = document.querySelectorAll("nav a");
        const sections = document.querySelectorAll(".page-section");
        


        
        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();


                links.forEach((l) => l.classList.remove("active"));
                link.classList.add("active");
                

                const pageName = link.getAttribute("data-page");
                sections.forEach((section) => {
                    section.classList.remove("active");
                });
                document.getElementById(pageName).classList.add("active");
            });
        });


        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let budgetLimit = parseFloat(localStorage.getItem('budgetLimit')) || 50000;


        const quotes = [
            "A penny saved is a penny earned.",
            "Save for a rainy day.",
            "Don't save what is left after spending; spend what is left after saving.",
            "The art is not in making money, but in keeping it.",
            "Small savings add up to big wealth.",
            "Your future self will thank you for saving today.",
            "Save money and money will save you."
        ];


        document.getElementById('savingQuote').textContent = quotes[Math.floor(Math.random() * quotes.length)];



        
        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        document.getElementById('calendar').textContent = now.getDate();
        document.getElementById('currentDate').textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;


        document.getElementById('expenseDate').valueAsDate = new Date();

        document.getElementById('budgetLimit').addEventListener('change', function() {
            budgetLimit = parseFloat(this.value);
            localStorage.setItem('budgetLimit', budgetLimit);
            updateBudget();
        });


        document.getElementById('expenseForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const expense = {
                id: Date.now(),
                name: document.getElementById('expenseName').value,
                amount: parseFloat(document.getElementById('expenseAmount').value),
                category: document.getElementById('expenseCategory').value,
                date: document.getElementById('expenseDate').value
            };
            
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            
            this.reset();
            document.getElementById('expenseDate').valueAsDate = new Date();
            
            renderExpenses();
            updateBudget();
            updateSummary();
        });

        function renderExpenses() {
            const expensesList = document.getElementById('expensesList');
            
            if (expenses.length === 0) {
                expensesList.innerHTML = '<p class="text-gray-500 text-center py-8">No expenses added yet</p>';
                return;
            }
            
            expensesList.innerHTML = expenses.slice().reverse().map(expense => `
                <div class="bg-[#0f0f0f] border border-[#3f3f3f] rounded-lg p-4 flex items-center justify-between hover:border-purple-500 transition-colors">
                    <div class="flex-1">
                        <h4 class="font-semibold text-white">${expense.name}</h4>
                        <p class="text-sm text-gray-400">${expense.category} • ${expense.date}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-lg font-bold text-purple-400">₹${expense.amount}</span>
                        <button onclick="deleteExpense(${expense.id})" class="text-purple-500 hover:text-purple-400 transition-colors">
                            <i class="ri-delete-bin-line text-xl"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }





 
        function deleteExpense(id) {
            expenses = expenses.filter(exp => exp.id !== id);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            renderExpenses();
            updateBudget();
            updateSummary();
        }


        function updateBudget() {
            const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const remaining = budgetLimit - totalSpent;
            const percentage = (totalSpent / budgetLimit) * 100;
            
            document.getElementById('totalSpent').textContent = `₹${totalSpent.toFixed(2)}`;
            document.getElementById('remaining').textContent = `₹${remaining.toFixed(2)}`;
            document.getElementById('budgetBar').style.width = `${Math.min(percentage, 100)}%`;
            

            const budgetBar = document.getElementById('budgetBar');
            if (percentage >= 90) {
                budgetBar.className = 'bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-300';
            } else if (percentage >= 70) {
                budgetBar.className = 'bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300';
            } else {
                budgetBar.className = 'bg-gradient-to-r from-green-400 to-purple-400 h-3 rounded-full transition-all duration-300';
            }
        }


        function updateSummary() {
            const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const totalSaved = budgetLimit - totalSpent;
            
            document.getElementById('summarySpent').textContent = `₹${totalSpent.toFixed(2)}`;
            document.getElementById('totalSaved').textContent = `₹${totalSaved.toFixed(2)}`;
            document.getElementById('totalTransactions').textContent = expenses.length;
            

            const categoryTotals = {};

            expenses.forEach(exp => {
                categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
            });
            
            const categoryBreakdown = document.getElementById('categoryBreakdown');
            if (Object.keys(categoryTotals).length === 0) {
                categoryBreakdown.innerHTML = '<p class="text-gray-500 text-center py-8">No spending data available</p>';
            } else {
                categoryBreakdown.innerHTML = Object.entries(categoryTotals).map(([category, amount]) => {
                    const percentage = (amount / totalSpent) * 100;
                    return `
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="text-gray-300">${category}</span>
                                <span class="font-semibold">₹${amount.toFixed(2)} (${percentage.toFixed(1)}%)</span>
                            </div>
                            <div class="w-full bg-[#0f0f0f] rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
            


            updateDailySpendingChart();
            

            const allTransactions = document.getElementById('allTransactions');
            if (expenses.length === 0) {
                allTransactions.innerHTML = '<p class="text-gray-500 text-center py-8">No transactions yet</p>';
            } else {
                allTransactions.innerHTML = expenses.slice().reverse().map(expense => `
                    <div class="bg-[#0f0f0f] border border-[#3f3f3f] rounded-lg p-4 flex items-center justify-between">
                        <div class="flex-1">
                            <h4 class="font-semibold text-white">${expense.name}</h4>
                            <p class="text-sm text-gray-400">${expense.category} • ${expense.date}</p>
                        </div>
                        <span class="text-lg font-bold text-purple-400">₹${expense.amount}</span>
                    </div>
                `).join('');
            }
        }




        let dailyChart = null;

        function updateDailySpendingChart() {
            
            const today = new Date();
            const last7Days = [];
            const dailyTotals = {};

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                last7Days.push(dateStr);
                dailyTotals[dateStr] = 0;
            }


            expenses.forEach(exp => {
                if (dailyTotals.hasOwnProperty(exp.date)) {
                    dailyTotals[exp.date] += exp.amount;
                }
            });


            const labels = last7Days.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            const data = last7Days.map(date => dailyTotals[date]);


            if (dailyChart) {
                dailyChart.destroy();
            }





            const ctx = document.getElementById('spendingChart').getContext('2d');
            dailyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Spending (₹)',
                        data: data,
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#a855f7',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            titleColor: '#a855f7',
                            bodyColor: '#fff',
                            borderColor: '#3f3f3f',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.parsed.y.toFixed(2);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#3f3f3f',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#9ca3af',
                                callback: function(value) {
                                    return '₹' + value;
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        }
                    }
                }
            });
        }





        renderExpenses();
        updateBudget();
        updateSummary();