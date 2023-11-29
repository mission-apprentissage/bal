import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

const modal = createModal({
  id: "download-cerfa-modal",
  isOpenedByDefault: false,
});

const DownloadModal = () => {
  const download = () => {
    modal.open();
  };

  return (
    <>
      <Button priority="secondary" type="button" nativeButtonProps={modal.buttonProps}>
        Télécharger
      </Button>
      <modal.Component
        title="Accept terms"
        iconId="fr-icon-checkbox-circle-line"
        buttons={[
          {
            linkProps: { href: "https://example.com", target: "_blank" },
            doClosesModal: false, //Default true, clicking a button close the modal.
            children: "Learn more",
          },
          {
            iconId: "ri-check-line",
            onClick: () => {
              download();
            },
            children: "Ok",
          },
        ]}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh
        finibus et. Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue
        accumsan tincidunt. Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo
        nunc quam et ligula. Ut nec ipsum sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer
        id nisi nec nulla luctus lacinia non eu turpis. Etiam in ex imperdiet justo tincidunt egestas. Ut porttitor urna
        ac augue cursus tincidunt sit amet sed orci.
      </modal.Component>
    </>
  );
};

export default DownloadModal;
