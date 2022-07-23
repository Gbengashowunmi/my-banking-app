'use strict';

/////////////////////////////////////////////////
// BANK APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const overlay = document.querySelector('.overlay');
const labelUsernameError = document.querySelector('.username-error-message');
const labelPinError = document.querySelector('.pin-error-message');

const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const labelLoginInformation = document.querySelector('.login_information');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const operations = document.querySelector('.operations');

const btnHamburger = document.querySelector('.hamburger');
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
  owner: 'Royalty Finn',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

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

////NAV BAR/////
const navToggle = () => {
  btnHamburger.classList.toggle('active');
  operations.classList.toggle('active');
  overlay.classList.toggle('active');
};
////hamburger function
btnHamburger.addEventListener('click', () => {
  // navToggle();
  btnHamburger.classList.toggle('active');
  operations.classList.toggle('active');
  overlay.classList.toggle('active');
  clearInterval(timer);
  timer = startLogOutTimer();
});
overlay.addEventListener('click', () => {
  btnHamburger.classList.remove('active');
  operations.classList.remove('active');
  overlay.classList.remove('active');
  clearInterval(timer);
  timer = startLogOutTimer();
});

///DISPLAY MOVEMENTS FUNCTION///
const displayMovements = function (account, sort = false) {
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  console.log(movs);
  // containerMovements.innerHTML =''

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

////////DISPLAY INCOME/OUT/INTEREST////////
const displaySummary = function (account) {
  /////income calculation
  // containerMovements.innerHTML =''
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

//////calculate balance function///////
const displayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  const formattedBalance = new Intl.NumberFormat('en-US').format(
    account.balance
  );
  // console.log(account.balance);
  labelBalance.textContent = `₦${formattedBalance}`;
};

//////TIMEOUT FUNCTION/////////
const startLogOutTimer = function () {
  const tick = () => {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Have an account? Sign in';
      btnHamburger.style.display = 'none';
    }
    time--;
  };
  let time = 240;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

////////////LOGIN HANDLER//////////////////
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  inputCloseUsername.value = inputClosePin.value = '';

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  //error message empty input url
  if (!currentAccount) {
    labelUsernameError.style.opacity = 1;
    labelUsernameError.textContent = 'Enter Valid Login details';
    setTimeout(() => (labelUsernameError.textContent = ''), 2000);
  }
  if (inputLoginUsername.value === '' && inputLoginPin.value === '') {
    labelUsernameError.style.opacity = 1;
    labelUsernameError.textContent = 'Enter Login details';
    setTimeout(() => (labelUsernameError.textContent = ''), 2000);
  } else if (inputLoginUsername.value === '') {
    labelUsernameError.textContent = 'Enter Username';
    labelUsernameError.style.opacity = 1;

    setTimeout(() => (labelUsernameError.textContent = ''), 2000);
  } else if (inputLoginPin.value === '') {
    labelPinError.style.opacity = 1;

    labelPinError.textContent = 'Enter Pin';
    setTimeout(() => (labelPinError.textContent = ''), 2000);
  } else if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    labelLoginInformation.style.display = 'none';

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    btnHamburger.style.display = 'block';
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

//////TRANSFER HANDLER////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const transferToUser = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  if (transferAmount.value === '' && transferToUser.value === '')
    alert('please enter transfer details');
  else if (transferAmount.value === '') alert('please enter Receiver details');
  else if (transferToUser.value === '') alert('please enter amount');
  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    transferToUser.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date());
    transferToUser.movementsDates.push(new Date());

    transferToUser.movements.push(transferAmount);
      containerMovements.innerHTML =''

    displayMovements(currentAccount);

    displaySummary(currentAccount);
    displayBalance(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

/////LOAN HANDLER///////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('loan');

  const loanAmount = +inputLoanAmount.value;

  // if (loanAmount.value === '') alert('please enter loan amount');

  if (loanAmount > 0) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      // console.log(currentAccount.movements);
      currentAccount.movementsDates.push(new Date());
      console.log(
        currentAccount.movements[currentAccount.movements.length - 1]
      );
      containerMovements.innerHTML =''

      displayMovements(currentAccount);
      displaySummary(currentAccount);
      displayBalance(currentAccount);
    }, 2000);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

///////CLOSE ACCOUNT HANDLER //////////
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
  containerMovements.innerHTML =''
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
const seconds = `${now.getSeconds()}`.padStart(2, 0);

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute} `;
