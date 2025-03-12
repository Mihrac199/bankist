'use strict';

// ELEMENTS
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


// CALLİNG FUNCTİONS
const formatMovementDate = function (date, locale) {
  function calcDisplayDay(date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  };

  const calcDay = calcDisplayDay(new Date(), date);

  if (calcDay === 0) return "Today";
  if (calcDay === 1) return "Yesterday";
  if (calcDay <= 7) return `${calcDay} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrent = function (mov, locale, currency) {

  const option = {
    style: "currency",
    currency: currency,
  };

  return new Intl.NumberFormat(locale, option).format(mov);
};


// MAİN FUNCTİONS
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";

  const downToTop = acc.movements.slice().sort(function (a, b) {
    if (a > b) {
      return 1;
    }
    if (b > a) {
      return -1;
    }
  });

  const movs = sort ? downToTop : acc.movements;

  movs.forEach(function (mov, i, arr) {

    let type;
    if (mov > 0) {
      type = "deposit"
    }
    else {
      type = "withdrawal"
    }

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrent(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${(i + 1)} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

function calcDisplayBalance(acc) {

  acc.balance = acc.movements.reduce(function (acc, accnt) {
    return acc + accnt;
  }, 0);

  labelBalance.textContent = formatCurrent(acc.balance, acc.locale, acc.currency);

};

function calcDisplaySummary(acc) {

  // Balance İn
  const balanceİn = acc.movements.filter(function (mov) {
    return mov > 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumIn.textContent = formatCurrent(balanceİn, acc.locale, acc.currency);


  // Balance Out
  const balanceOut = acc.movements.filter(function (mov) {
    return mov < 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumOut.textContent = formatCurrent(Math.abs(balanceOut), acc.locale, acc.currency);


  // Balance İnterest
  const balanceİnterest = acc.movements.filter(function (mov) {
    return mov > 0;
  }).map(function (deposit) {
    return deposit * acc.interestRate / 100;
  }).filter(function (deposit) {
    return deposit >= 1;
  }).reduce(function (acc, interest) {
    return acc + interest;
  }, 0);
  labelSumInterest.textContent = formatCurrent(balanceİnterest, acc.locale, acc.currency);

};

function uptadeUI(currentAccount) {

  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);

};

function uptadeUI_2(elmnt1, elmnt2, elmntblr1, elmntblr2) {

  elmnt1.value = "";
  elmnt2.value = "";
  elmntblr1.blur();
  elmntblr2.blur();

};

function startLogOutTimer() {

  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";

      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 60 * 5;

  tick();

  const timer = setInterval(tick, 1000);

  return timer;
};

function createUsernames(accs) {

  accs.forEach(function (acc) {

    acc.username = acc.owner.toLowerCase().split(" ").map(function (name) {
      return name[0];
    }).join("");

  })
};


// DATA'S
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2024-07-11T23:36:17.929Z',
    '2024-07-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-06-25T18:49:59.371Z',
    '2024-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2];
createUsernames(accounts);


// TRANSLATİON
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


// START OF THE LOGİN
let currentAccount, timer;
btnLogin.addEventListener("click", function (element) {
  element.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`;

    containerApp.style.opacity = 100;

    const operation = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    const now = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, operation).format(now);

    uptadeUI(currentAccount);

    uptadeUI_2(inputLoginUsername, inputLoginPin, inputLoginUsername, inputLoginPin);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }

});

// OPERATION: TRANSFERS
btnTransfer.addEventListener("click", function (element) {
  element.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const toTransfer = accounts.find(function (acc) {
    return inputTransferTo.value === acc.username;
  });

  if (amount > 0 &&
    toTransfer &&
    currentAccount?.username !== toTransfer.username &&
    currentAccount.balance >= amount
  ) {

    setTimeout(function () {

      // DOİNG TO TRANSFER
      currentAccount.movements.push(-amount);
      toTransfer.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      toTransfer.movementsDates.push(new Date().toISOString());

      uptadeUI(currentAccount);

      // RESET TİMER
      clearInterval(timer);
      timer = startLogOutTimer();

    }, 5000)

  }

  uptadeUI_2(inputTransferTo, inputTransferAmount, inputTransferTo, inputTransferAmount);

});

// OPERATION: LOAN
btnLoan.addEventListener("click", function (element) {
  element.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  const condition = currentAccount.movements.some(function (mov) {
    return mov >= amount * 10 / 100;
  });

  if (amount > 0 && condition) {
    setTimeout(function () {

      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      uptadeUI(currentAccount);

      // RESET TİMER
      clearInterval(timer);
      timer = startLogOutTimer();

    }, 5000);

    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

// OPERATION: CLOSE
btnClose.addEventListener("click", function (element) {
  element.preventDefault();

  if (currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    accounts.splice(index, 1);

    uptadeUI_2(inputCloseUsername, inputClosePin, inputCloseUsername, inputClosePin);

    containerApp.style.opacity = 0;

    labelWelcome.textContent = "Log in to get started";
  }
});

// SORT BUTTON
let shortButtonClick = false;
btnSort.addEventListener("click", function (element) {
  element.preventDefault();

  displayMovements(currentAccount, !shortButtonClick);

  shortButtonClick = !shortButtonClick;

});