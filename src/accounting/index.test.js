const {
  INITIAL_BALANCE,
  readBalance,
  resetBalance,
  viewBalance,
  creditAccount,
  debitAccount,
  isValidChoice,
  isExitChoice,
} = require('./index');

describe('Accounting application business logic', () => {
  beforeEach(() => {
    resetBalance();
  });

  test('TC-001 View current account balance', () => {
    const result = viewBalance();
    expect(result).toBe('Current balance: 1000.00');
  });

  test('TC-002 Credit account with a positive amount', () => {
    const initialBalance = readBalance();
    expect(initialBalance).toBe(INITIAL_BALANCE);

    const result = creditAccount('200.00');

    expect(result.success).toBe(true);
    expect(result.balance).toBeCloseTo(1200.0);
    expect(result.message).toBe('Amount credited. New balance: 1200.00');
    expect(readBalance()).toBeCloseTo(1200.0);
  });

  test('TC-003 Debit account with sufficient funds', () => {
    resetBalance();
    const result = debitAccount('150.00');

    expect(result.success).toBe(true);
    expect(result.balance).toBeCloseTo(850.0);
    expect(result.message).toBe('Amount debited. New balance: 850.00');
    expect(readBalance()).toBeCloseTo(850.0);
  });

  test('TC-004 Debit account with insufficient funds', () => {
    resetBalance();
    const result = debitAccount('1500.00');

    expect(result.success).toBe(false);
    expect(result.balance).toBeCloseTo(INITIAL_BALANCE);
    expect(result.message).toBe('Insufficient funds for this debit.');
    expect(readBalance()).toBeCloseTo(INITIAL_BALANCE);
  });

  test('TC-005 Reject invalid menu selection', () => {
    const invalidChoices = ['0', '5', 'abc', ''];
    invalidChoices.forEach((choice) => {
      expect(isValidChoice(choice)).toBe(false);
    });
  });

  test('TC-006 Exit application cleanly', () => {
    expect(isExitChoice('4')).toBe(true);
  });

  test('TC-007 Starting balance default', () => {
    expect(readBalance()).toBeCloseTo(INITIAL_BALANCE);
  });

  test('TC-008 Data persistence within runtime', () => {
    const creditResult = creditAccount('100.00');
    expect(creditResult.success).toBe(true);
    expect(readBalance()).toBeCloseTo(1100.0);

    const viewResult = viewBalance();
    expect(viewResult).toBe('Current balance: 1100.00');
  });

  test('TC-009 Data update after debit success', () => {
    const debitResult = debitAccount('50.00');
    expect(debitResult.success).toBe(true);
    expect(readBalance()).toBeCloseTo(950.0);

    const viewResult = viewBalance();
    expect(viewResult).toBe('Current balance: 950.00');
  });
});
