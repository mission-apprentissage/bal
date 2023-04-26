describe("Home page", () => {
  it("should render the main page", () => {
    cy.visit("https://bal-recette.apprentissage.beta.gouv.fr/");
    cy.get("h1").should("contain", "BAL");
  });
});
