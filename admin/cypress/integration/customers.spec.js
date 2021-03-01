beforeEach(() => {
  cy.visit("customers");
});


describe("It test customers", () => {
    it('creates multiple new customers', () => {
      // creates a new customer and check it exists
      cy.createCustomer("1");
      cy.get("table").should('contain', 'John-1')

      // tries to recreate previous customer and verifies an error is received
      cy.createCustomer("1");
      cy.get('.MuiAlert-message').should('contain', "le client n'a pas pû être créé")
      cy.get('button[aria-label="cancel"]').click({force: true});

      // creates a new customer and check it exists
      cy.createCustomer("2");
      cy.get("table").should('contain', 'John-2');

      // it visits the page again and check all customers exist
      cy.reload(true)
      cy.get("table").should('contain', 'John-1')
      cy.get("table").should('contain', 'John-2');
    });

    it('updates a customer', () => {
      cy.createCustomer("3");
      cy.get("table").should('contain', 'John-3')

      cy.get('button[aria-label="edit"]').eq(0).click();
      cy.get('input[name="firstName"]').clear().type(`foo`);
      cy.get('input[name="lastName"]').clear().type(`bar`);
      cy.get('input[name="email"]').clear().type(`foo.bar@gmail.com`);
      cy.get('input[name="phone"]').clear().type(`+336789835777`);
      cy.get('form').submit();

      cy.get("table")
        .should('contain', 'foo bar')
        .should('contain', 'foo.bar@gmail.com')
        .should('contain', '+336789835777');
    });

    it('deletes a customer', () => {
      cy.get('button[aria-label="delete"]').eq(0).click();
      cy.get('form').submit();
      cy.get('.MuiAlert-message').should('contain', "Le client a été supprimé")
    });

});

