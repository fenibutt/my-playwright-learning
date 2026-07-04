/**
 * Test users and inputs for the SauceDemo application.
 * See https://www.saucedemo.com for the full list of accepted accounts.
 */

export type User = {
  username: string;
  password: string;
};

export const standardUser: User = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const lockedOutUser: User = {
  username: 'locked_out_user',
  password: 'secret_sauce',
};

export const problemUser: User = {
  username: 'problem_user',
  password: 'secret_sauce',
};

/** A username/password pair that is not accepted by the service. */
export const invalidUser: User = {
  username: 'standard_user',
  password: 'wrong_password',
};

/** Sample customer details used in the checkout flow. */
export const checkoutInfo = {
  firstName: 'Veronika',
  lastName: 'Kulik',
  postalCode: '00-001',
};

/** Product slugs used with add-to-cart / remove buttons. */
export const products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTShirt: 'sauce-labs-bolt-t-shirt',
};

/** Error messages returned by the SauceDemo UI. */
export const errors = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  wrongCredentials:
    'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  firstNameRequired: 'Error: First Name is required',
};
