import React, { Component } from 'react';
import '../style/ticket.css';

class SupportTicketSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1,
      title: '',
      description: '',
      priority: 'Moyenne', // Priorité par défaut
      status: 'Ouvert',
      device: 'Windows', // Périphérique par défaut
      successMessage: '',
      file: null,
      fileName: '', // Nom du fichier sélectionné
    };
  }

  // Méthode pour réinitialiser le formulaire
  resetForm = () => {
    this.setState({
      title: '',
      description: '',
      priority: 'Moyenne', // Réinitialiser la priorité
      device: 'Windows', // Réinitialiser le périphérique
      file: null,
      fileName: '', // Réinitialiser le nom du fichier
    });
  };

  // Fonction pour gérer les changements de fichier
  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      file: file,
      fileName: file ? file.name : '', // Mettre à jour le nom du fichier
    });
  };

  // Fonction pour soumettre le ticket au backend
  createTicket = () => {
    const { userID, title, description, priority, status, file, device } = this.state;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('action', 'createTicket');
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    formData.append('device', device); // Ajouter le périphérique au formulaire

    fetch('http://localhost/ParlonsPC1/php/tickets.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        window.alert('Merci, votre demande a bien été envoyée ! ');
        this.resetForm();
      })
      .catch((error) => {
        console.error('Erreur lors de la création du ticket :', error);
      });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div className="container">
        <div className="ticket-form">
        <h1>Système de Tickets de Support</h1>
        {this.state.successMessage && (
          <div className="success-message">{this.state.successMessage}</div>
        )}
        <div>
          <input
            type="text"
            placeholder="Titre du ticket"
            name="title"
            value={this.state.title}
            onChange={this.handleInputChange}
          />
          <textarea
            placeholder="Description du ticket"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}
          ></textarea>
          <select
            name="priority"
            value={this.state.priority}
            onChange={this.handleInputChange}
          >
            <option value="Basse">Basse</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
          </select>
          <select
            name="device"
            value={this.state.device}
            onChange={this.handleInputChange}
          >
            <option value="Windows">Windows</option>
            <option value="Mac">Mac</option>
            <option value="Linux">Linux</option>
          </select>
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={this.handleFileInputChange}
            value={''}
          />
          {this.state.fileName && <div>Fichier sélectionné : {this.state.fileName}</div>}
          <button onClick={this.createTicket}>Créer un ticket</button>
        </div>
        </div>
      </div>
    );
  }
}

export default SupportTicketSystem;
