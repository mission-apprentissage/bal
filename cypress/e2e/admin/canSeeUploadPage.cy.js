describe("canSeeUploadPage", () => {
  it("tests canSeeUploadPage", () => {
    cy.viewport(1381, 992);
    cy.visit("https://bal-recette.apprentissage.beta.gouv.fr/");
    cy.get("#menu-button-\\:Rlab5femH1\\:").click();
    cy.get("[data-id='menuitem\\:importfile']").type("Import de fichier");
  });
});
//# recorderSourceMap=BCBDBEBFB
