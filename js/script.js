const authForm = document.querySelector('#authForm');
const profileName = document.querySelector('#profileName');
const userDataStorage = localStorage.getItem('userData');
const btnSetBalance = document.querySelector('#btnSetBalance');
const balance = document.querySelector('#balance');
const btnUpdateBalance = document.querySelector('#btnUpdateBalance');
const typeTransaction = document.querySelector('#typeTransaction');
const descTransaction = document.querySelector('#descTransaction');
const sumTransaction = document.querySelector('#sumTransaction');
const incomeTable = document.querySelector('#incomeTable');
const expensesTable = document.querySelector('#expensesTable');
const toastLive = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

if (authForm) {
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const userData = JSON.parse(localStorage.getItem('userData')) || {
            email: '',
            password: '',
            balance: 0,
            income: [],
            expenses: []
        };

        if (!userData.email) {
            userData.email = email;
            userData.password = password;
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = '/dashboard.html';
        } else {
            if (userData.password !== password ||  userData.email !== email) {
                toastBootstrap.show();
            } else {
                window.location.href = '/dashboard.html';
            }
        }
    });
}

if (profileName && JSON.parse(userDataStorage).email ) {
    profileName.textContent = `Профиль (${JSON.parse(userDataStorage).email})` 
}

if (balance) {
    const data = JSON.parse(localStorage.getItem('userData')) || { income: [], expenses: [], balance: 0 };

    balance.value = data.balance;;
}

if (btnSetBalance) {
    btnSetBalance.addEventListener('click', () => {
        localStorage.setItem('userData', JSON.stringify({...JSON.parse(userDataStorage), balance: Number(balance.value)}))

        balance.setAttribute('disabled', true);
        btnSetBalance.setAttribute('disabled', true);
    })
}

if (typeTransaction) {
    btnUpdateBalance.addEventListener('click', () => {
       const transaction = {
        type: typeTransaction.value,
        description: descTransaction.value,
        sum: Number(sumTransaction.value)
       }

       if (typeTransaction.value === 'income' || typeTransaction.value === 'expenses') {
            const data = JSON.parse(userDataStorage);
            
            data[typeTransaction.value].push(transaction);
            
            data.balance = data.income.reduce((total, income) => total + income.sum, 0) - data.expenses.reduce((total, expense) => total + expense.sum, 0);

            balance.value = data.balance;
            balance.setAttribute('disabled', true);
            btnSetBalance.setAttribute('disabled', true);

            localStorage.setItem('userData', JSON.stringify(data));
       }
    })
}

if (incomeTable) {
    const incomeArr = JSON.parse(localStorage.getItem('userData')).income;

    incomeArr.forEach((el, index) => {
        const tr = document.createElement('tr');
        tr.classList.add("table-success")

        const thCount = document.createElement('th');
        thCount.insertAdjacentHTML('beforeend', index + 1);

        const tdType = document.createElement('td');
        tdType.insertAdjacentHTML('beforeend', 'Доходы');

        const tdDesc = document.createElement('td');
        tdDesc.insertAdjacentHTML('beforeend', el.description);

        const tdSum = document.createElement('td')
        tdSum.insertAdjacentHTML('beforeend', `+${el.sum}`);

        tr.appendChild(thCount)
        tr.appendChild(tdType)
        tr.appendChild(tdDesc)
        tr.appendChild(tdSum)

        incomeTable.appendChild(tr)
    })
}

if (expensesTable) {
    const expensesArr = JSON.parse(localStorage.getItem('userData')).expenses;

    expensesArr.forEach((el, index) => {
        const tr = document.createElement('tr');
        tr.classList.add("table-danger")

        const thCount = document.createElement('th');
        thCount.insertAdjacentHTML('beforeend', index + 1);

        const tdType = document.createElement('td');
        tdType.insertAdjacentHTML('beforeend', 'Расходы');

        const tdDesc = document.createElement('td');
        tdDesc.insertAdjacentHTML('beforeend', el.description);

        const tdSum = document.createElement('td')
        tdSum.insertAdjacentHTML('beforeend', `-${el.sum}`);

        tr.appendChild(thCount)
        tr.appendChild(tdType)
        tr.appendChild(tdDesc)
        tr.appendChild(tdSum)

        expensesTable.appendChild(tr)
    })
}