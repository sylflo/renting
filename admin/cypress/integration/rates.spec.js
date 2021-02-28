beforeEach(() => {
  cy.visit("rates");
});

describe('rating section', () => {
  it('creates a rating', () => {
    cy.createRate();


    cy.get('main').should('contain', '2021');
    cy.get('button').eq(0).click();
    cy.get('main').should('contain', 'VERY_LOW_SEASON');
    cy.get('main').should('contain', '380');
    cy.get('main').should('contain', '60');
    cy.get('main').should('contain', '120');
    cy.get('main').should('contain', '1');
  });

  it('updates a rating', () => {
    cy.get('button').eq(0).click();
    cy.get('button[aria-label="edit"]').eq(0).click();
    cy.get('input[name="weekend"]').clear().type(`70`);
    cy.get('form').submit();
    cy.wait(5000)

    cy.visit("rates");
    cy.get('button').eq(0).click();
  });

  it('deletes a rating', () => {
    cy.get('button').eq(0).click();
    cy.get('button[aria-label="delete-rate"]').eq(0).click();
    cy.get('form').submit();

    cy.get('main').should('not.contain', '2021');
  });
});

// describe('seasons section', () => {
//   it('creates a season', () => {
//     cy.createRate();
//     cy.wait(5000)
    
//     cy.get('button[aria-label="Season"]').click({force: true});
//     cy.get('#season').click({force: true});
//     cy.get('li[data-value="VERY_LOW_SEASON"]').click();
//     cy.get('input').eq(2).clear().type('01/02/2021');
//     cy.get('input').eq(3).clear().type('02/19/2021');
//     cy.get('form').submit();
//     cy.wait(5000)
//     cy.visit("rates");

//     cy.get('button').eq(0).click();
//     cy.get('main').should('contain', '01-01-2021');
//   });

//   it('deletes a season', () => {
//     cy.get('button').eq(0).click();
//     cy.get('button[aria-label="delete"]').click({force: true});
//     cy.get('form').submit();
//   });
// });
