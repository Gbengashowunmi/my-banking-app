'use strict';

/////////////////////////////////////////////////
// BANK APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Data

const accountA = {
  owner: 'Gbenga Showunmi',
  movements: [200, 4500, -400, 3000, -650, -130, 7000, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:31:42.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accountB = {
  owner: 'Hamdala Odunlami',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const accountC = {
  owner: 'Yinka Showunmi',
  movements: [2000, -200, 3400, -300, -20, 5000, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:31:42.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accountD = {
  owner: 'Razaq Showunmi',
  movements: [430, 10000, 7000, 50, 90],
  interestRate: 1,
  pin: 4444,
};
// console.log(accountC);
const accounts = [accountA, accountB, accountC, accountD];

const username = accs => {
  accs.forEach(acc => {
    const fullName = acc.owner.toLowerCase().split(' ');
    acc.username = fullName[0] + fullName[1][0].toUpperCase();
  });
};

username(accounts);

/////////////////////////////////////////////////
// LOGIC

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

///////////DISPLAY MOVEMENTS/////////////
const displayMovements = function (account, sort = false) {
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const transactionType = mov > 0 ? 'deposit' : 'withdrawal';

    const formattedMov = new Intl.NumberFormat('en-US').format(mov.toFixed(4));
    const date = new Date(account.movementsDates[i]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}/${month}/${year}`;
    const html = `
  <div class="movements__row">
  <div class="movements__type         movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
     <div class="movements__date">${displayDate}</div>
    <div class="movements__value">₦${formattedMov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

////////////////////////////////////
// console.log(accountA.movements);

///////////DISPLAY INCOME/OUT/INTEREST///////////
const displaySummary = function (account) {
  /////income calculation
  const incomes = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  const formattedIncome = new Intl.NumberFormat('en-US').format(incomes);
  labelSumIn.textContent = `₦${formattedIncome}`;
  ///out calculation
  const out = account.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  const outAbs = Math.abs(out);
  const formattedOut = new Intl.NumberFormat('en-US').format(outAbs);
  labelSumOut.textContent = `₦${formattedOut}`;

  //////interest calculation
  const interest = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * account.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);

  // console.log(interest);
  labelSumInterest.textContent = `₦${Math.round(interest)}`;
};

//////calculate balance///////
const displayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  const formattedBalance = new Intl.NumberFormat('en-US').format(
    account.balance
  );
  // console.log(balance);
  labelBalance.textContent = `₦${formattedBalance}`;
};
////////////LOGIN ACTION//////////////////
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  inputCloseUsername.value = inputClosePin.value = '';

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  // console.log(currentAccount);

  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    // console.log('LOGIN');
    containerApp.style.opacity = 1;
    displayMovements(currentAccount);
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    displaySummary(currentAccount);
    displayBalance(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin;
  }
});
//////Transfer Action////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const transferToUser = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  console.log(transferToUser, transferAmount, currentAccount.balance);
  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    transferToUser.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date());
    transferToUser.movementsDates.push(new Date());

    transferToUser.movements.push(transferAmount);
    displayMovements(currentAccount);

    displaySummary(currentAccount);
    displayBalance(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});

/////LOAN///////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('loan');
  const loanAmount = +inputLoanAmount.value;
  if (loanAmount > 0) {
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date());
  }
displaySummary(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
});

///////CLOSE ACCOUNT //////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('close');
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    console.log(index);
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

////////D  A   T   E////////////////

const now = new Date();

const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const minute = `${now.getMinutes()}`.padStart(2, 0);

// console.log(day, +month, +year, hour, +minute);

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute} `;

