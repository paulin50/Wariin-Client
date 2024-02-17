import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { PrintComponent } from "./PrintComponent";
import { Modal } from "reactstrap";
import { AuthContext } from "../context/AuthContext";

export const PrintModal = (props) => {
  const componentRef = React.useRef(null);
  const { entreprise, } = React.useContext(AuthContext);
  const onBeforeGetContentResolve = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  React.useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <Modal className="modal-dialog-centered"
      isOpen={props.showModal}
      toggle={props.toggleModal}
      data={props.data}
      total={props.total}
      client={props.client}
      style={{ borderRadius: '0px', width: "90mm", }}
    >
      <PrintComponent ref={componentRef} text={text}
        data={props.data}
        total={props.total}
        client={props.client}
        entreprise={entreprise}
        montantRegle={props.montantRegle}
        montantRendu={props.montantRendu}
      />
      <div style={{ background: '#fff', display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
        <button
          style={{ background: '#EAEAEA', borderRadius: "0px", padding: "2px 25px", boxShadow: 'none', color: "#000", border: '0', }}
          onClick={() => props.toggleModal()}
        >
          Annuler
        </button>
        <button
          disabled={loading}
          style={{ background: '#32D689', borderRadius: "0px", padding: "2px 20px", boxShadow: 'none', color: "#fff", border: '0', }}
          onClick={handlePrint}
        >
          {loading ? 'Loading...' : 'Imprimer'}
        </button>
      </div>
    </Modal>
  );
};
