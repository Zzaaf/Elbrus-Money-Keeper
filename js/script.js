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
const logoutBtn = document.querySelector('#logoutBtn');
const changeForm = document.querySelector('#changeForm');

if (authForm) {
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const userData = JSON.parse(localStorage.getItem('userData')) || {
            email: '',
            password: '',
            balance: null,
            income: [],
            expenses: []
        };

        if (!userData.email) {
            userData.email = email;
            userData.password = password;
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = '/dashboard.html';
        } else {
            if (userData.password !== password || userData.email !== email) {
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
    const data = JSON.parse(userDataStorage)                       
    data.balance = data.income.reduce((total, income) => total + income.sum, 0) - data.expenses.reduce((total, expense) => total + expense.sum, 0);
    localStorage.setItem('userData', JSON.stringify(data))

    balance.value = data.balance;

    if (data.balance) {
        balance.setAttribute('disabled', true);
        btnSetBalance.setAttribute('disabled', true);
    }
}

if (btnSetBalance) {
    btnSetBalance.addEventListener('click', () => {
        const data = JSON.parse(userDataStorage);            
        data.income.push({type: 'income', description: 'Пополнение', sum: Number(balance.value)});
        data.balance = Number(balance.value);

        localStorage.setItem('userData', JSON.stringify(data))

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

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => window.location.href = '/auth.html')
}

if (changeForm) {
    const userData = JSON.parse(localStorage.getItem('userData'))
    changeForm.email.value = userData.email;
    changeForm.password.value = userData.password;

    changeForm.addEventListener('submit', () => {
        localStorage.setItem('userData', JSON.stringify({...userData, email: changeForm.email.value, password: changeForm.password.value }));
        window.location.href = '/dashboard.html';
    })
}