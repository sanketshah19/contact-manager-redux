import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Button, Card, CardColumns, Form} from 'react-bootstrap';

import {startGetAllContacts, startDeleteContact, startSearchContact} from '../../actions/contacts';

class ContactsList extends React.Component{

    componentDidMount(){
        this.props.dispatch(startGetAllContacts())
    }

    handleRemove(id){
        this.props.dispatch(startDeleteContact(id))
    }

    handleSearch = (e) => {
        const value = e.target.value
        this.props.dispatch(startSearchContact(value))
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4"><h2>Listing Contacts - {this.props.contacts.length}</h2></div>
                    <div className="col-md-2"><Link to="/contacts/new"><Button variant="outline-primary">Add Contact</Button></Link> </div>
                    <div className="col-md"><Form.Control onChange={this.handleSearch} className="form-control" type="search" placeholder="Search by name or mobile number"/></div>
                </div><hr/>
                
                <CardColumns className="row">
                {
                    this.props.contacts.map((contact) => {
                        return (
                            <div className="col-md-4 mr-0"  key={contact._id}>
                                <Card border="primary" bg="light" text="black" style={{width: "15rem", borderRadius: "15px" }}>
                                    <Card.Body>
                                        <Card.Title>Name: {contact.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{contact.category}</Card.Subtitle>
                                        <Card.Text>
                                        <strong>Email</strong>: {contact.email}<br/>
                                        <strong>Mobile</strong>: {contact.mobile}
                                        </Card.Text>
                                        <Card.Link href={`/contacts/${contact._id}`}>Show</Card.Link>
                                        <Card.Link href={`/contacts/edit/${contact._id}`}>Edit</Card.Link>
                                        <Card.Link href="#" onClick={() => this.handleRemove(contact._id)}>Remove</Card.Link>
                                    </Card.Body>
                                </Card>
                            </div>
                        )
                    })
                }
                </CardColumns>
            </div>
        )
    }


}

const mapStateToProps = (state) => {
    return {
        contacts: state.contacts
    }
}

export default connect(mapStateToProps)(ContactsList)