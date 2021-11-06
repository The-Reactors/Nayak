import {Modal,Button} from 'react-bootstrap'

const ConfirmModal = (props) => {


return <Modal data-aos="fade-up" data-aos-delay="300" show = {props.showModal}
    animation={false}
      
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
        <h2>Update Status</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{textAlign:"center"}}>
          <br/>
        <h2>Are you sure you want to set the status of the ticket to Solved ?<br/></h2>
        <p>
        
        <h3><b>Note : This action can't be UNDONE</b></h3>
        </p>
        <br/>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.proceedingFxn}>Accept</Button>
        <Button onClick={props.closeModal}>Reject</Button>
      </Modal.Footer>
    </Modal>
    
}

export default ConfirmModal