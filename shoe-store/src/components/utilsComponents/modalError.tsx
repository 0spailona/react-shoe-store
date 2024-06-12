import { Modal} from "react-bootstrap";

export default function ModalError() {



    return (
        <Modal>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        </Modal>
    )
}