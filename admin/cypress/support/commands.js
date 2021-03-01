// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("createCustomer", (id) => {
  // add customer
  cy.get('[aria-label="add"]').click();
  cy.get('input[name="firstName"]').type(`John-${id}`);
  cy.get('input[name="lastName"]').type(`John-${id}`);
  cy.get('input[name="email"]').type(`john.doe.${id}@gmail.com`);
  cy.get('input[name="phone"]').type(`+33678983575${id}`);
  // TODO add language
  // address
  cy.get('input[name="line1"]').type('rue Emile Zola');
  //cy.get('input[name="line2"]').type('rue Emile Zola'); line2 is optionnal
  cy.get('input[name="postalCode"]').type('75000');
  cy.get('input[name="city"]').type('Paris');
  cy.get('input[name="country"]').type('France');

  cy.get('form').submit();
});

Cypress.Commands.add('createRate', () => {
  cy.get('button[aria-label="Rate"]').click({force: true});

  cy.get('#title').click()
  cy.get('li[data-value="VERY_LOW_SEASON"]').click();
  cy.get('input[name="year"]').clear().type('2021');
  cy.get('input[name="color"]').clear().type('#ffffff');
  cy.get('input[name="week"]').clear().type('380');
  cy.get('input[name="night"]').clear().type('60');
  cy.get('input[name="weekend"]').clear().type('120');
  cy.get('input[name="minimumDuration"]').clear().type('1');
  cy.get('form').submit();
});