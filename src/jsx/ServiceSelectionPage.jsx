import React, { Component } from 'react';
import '../style/ticket.css';

class ServiceSelectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDevices: [],
      selectedServices: [],
    };
  }

  
  // Fonction pour gérer la sélection d'un périphérique
  handleDeviceSelection = (event) => {
    const device = event.target.value;
    this.setState({
      selectedDevices: [device], // Remplacer la sélection précédente par le nouveau choix
    });
  };

  
  // Fonction pour gérer la sélection d'un service
  handleServiceSelection = (event) => {
    const service = event.target.value;
    this.setState((prevState) => ({
      selectedServices: prevState.selectedServices.includes(service)
        ? prevState.selectedServices.filter((s) => s !== service)
        : [...prevState.selectedServices, service],
    }));
  };
  // Fonction pour valider les choix
  handleValidation = () => {
    // Effectuez ici les actions nécessaires avec les choix
    console.log('Périphériques sélectionnés :', this.state.selectedDevices);
    console.log('Services sélectionnés :', this.state.selectedServices);
  };

  // Fonction pour déterminer si un périphérique est sélectionné
  isDeviceSelected = (device) => {
    return this.state.selectedDevices.includes(device);
  };

  // Fonction pour déterminer si un service est sélectionné
  isServiceSelected = (service) => {
    return this.state.selectedServices.includes(service);
  };

  render() {
    return (
      <div className="container">
        <div className="service-form">
          <h1>Sélection de services</h1>
          <div>
            <h2>Choisissez votre périphérique :</h2>
            <select onChange={this.handleDeviceSelection}>
              <option value="Mac">Mon Mac</option>
              <option value="Windows">Mon ordinateur avec Windows</option>
              <option value="Linux">Mon ordinateur sur Linux</option>
              <option value="Unknown">Je ne connais pas mon système d'exploitation</option>
            </select>
          
        </div>
       
          <div>
            <h2>Choisissez les services nécessaires :</h2>
            <select multiple onChange={this.handleServiceSelection}>
              <option value="Reinstallation" className={this.isServiceSelected('Reinstallation') ? 'selected' : ''}>
                Réinstallation de mon ordinateur
              </option>
              <option value="Backup" className={this.isServiceSelected('Backup') ? 'selected' : ''}>
                Sauvegarde de mes données
              </option>
              <option value="Restauration" className={this.isServiceSelected('Restauration') ? 'selected' : ''}>
                Restauration de mon ordinateur à une date antérieure
              </option>
              <option value="PasswordReset" className={this.isServiceSelected('PasswordReset') ? 'selected' : ''}>
                Réinitialisation de mot de passe
              </option>
              <option value="VirusRemoval" className={this.isServiceSelected('VirusRemoval') ? 'selected' : ''}>
                Suppression des virus sur mon ordinateur
              </option>
            </select>
          </div>
          <div>
            <button onClick={this.handleValidation}>Valider mes choix</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceSelectionPage;