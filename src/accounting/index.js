const readline = require('readline');

const INITIAL_BALANCE = 1000.0;
let storageBalance = INITIAL_BALANCE;
let rl;

function readBalance() {
  return storageBalance;
}

function writeBalance(newBalance) {
  storageBalance = newBalance;
}

function resetBalance() {
  storageBalance = INITIAL_BALANCE;
}

function formatCurrency(value) {
  return Number(value).toFixed(2);
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function viewBalance() {
  return `Current balance: ${formatCurrency(readBalance())}`;
}

function creditAccount(amount) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return {
      success: false,
      balance: readBalance(),
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  const currentBalance = readBalance();
  const newBalance = currentBalance + numericAmount;
  writeBalance(newBalance);

  return {
    success: true,
    balance: newBalance,
    message: `Amount credited. New balance: ${formatCurrency(newBalance)}`,
  };
}

function debitAccount(amount) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    return {
      success: false,
      balance: readBalance(),
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  const currentBalance = readBalance();
  if (currentBalance >= numericAmount) {
    const newBalance = currentBalance - numericAmount;
    writeBalance(newBalance);
    return {
      success: true,
      balance: newBalance,
      message: `Amount debited. New balance: ${formatCurrency(newBalance)}`,
    };
  }

  return {
    success: false,
    balance: currentBalance,
    message: 'Insufficient funds for this debit.',
  };
}

function isValidChoice(choice) {
  return ['1', '2', '3', '4'].includes(choice);
}

function isExitChoice(choice) {
  return choice === '4';
}

async function handleViewBalance() {
  console.log(viewBalance());
}

async function handleCreditAccount() {
  const amountText = await prompt('Enter credit amount: ');
  const result = creditAccount(amountText);
  console.log(result.message);
}

async function handleDebitAccount() {
  const amountText = await prompt('Enter debit amount: ');
  const result = debitAccount(amountText);
  console.log(result.message);
}

function initializeReadline(input = process.stdin, output = process.stdout) {
  rl = readline.createInterface({
    input,
    output,
  });
}

async function main() {
  initializeReadline();

  let shouldContinue = true;

  while (shouldContinue) {
    displayMenu();
    const choice = await prompt('Enter your choice (1-4): ');

    switch (choice) {
      case '1':
        await handleViewBalance();
        break;
      case '2':
        await handleCreditAccount();
        break;
      case '3':
        await handleDebitAccount();
        break;
      case '4':
        shouldContinue = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
        break;
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

function closeReadline() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

module.exports = {
  INITIAL_BALANCE,
  readBalance,
  writeBalance,
  resetBalance,
  formatCurrency,
  viewBalance,
  creditAccount,
  debitAccount,
  isValidChoice,
  isExitChoice,
  displayMenu,
  initializeReadline,
  closeReadline,
};

if (require.main === module) {
  main().catch((error) => {
    console.error('An error occurred:', error);
    closeReadline();
  });
}
