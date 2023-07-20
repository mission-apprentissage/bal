describe("can-access-upload-page", () => {
  it("tests can-access-upload-page", () => {
    cy.viewport(1140, 1221);
    cy.visit("https://bal-recette.apprentissage.beta.gouv.fr/");
    cy.get("#menu-button-\\:R1akmautjaH1\\:").click();
    cy.get("[data-id='menuitem\\:admin\\:manage-files']").click();
  });
});
//# recorderSourceMap=BCBDBEBFBGA
