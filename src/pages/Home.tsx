import {
  IonAlert,
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { deleteAllIncidents, getIncidents, saveIncident } from '../storage';

const Home: React.FC = () => {
  const [view, setView] = useState('home');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const fetchIncidents = async () => {
    const incidents = await getIncidents();
    setIncidents(incidents);
  };

  useEffect(() => {
    if (view === 'list') {
      fetchIncidents();
    }
  }, [view]);

  const handleRegister = async () => {
    const photoUrl = photo ? URL.createObjectURL(photo) : '';
    const audioUrl = audio ? URL.createObjectURL(audio) : '';
    const incident = { title, date, description, photo: photoUrl, audio: audioUrl };
    await saveIncident(incident);
    setTitle('');
    setDate(undefined);
    setDescription('');
    setPhoto(null);
    setAudio(null);
    setView('list');
  };

  const handleDeleteAll = async () => {
    await deleteAllIncidents();
    setIncidents([]);
  };

  if (view === 'home') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonButton expand="full" onClick={() => setView('register')} color="primary">
            Registrar Incidencia
          </IonButton>
          <IonButton expand="full" onClick={() => setView('list')} color="secondary">
            Ver Incidencias
          </IonButton>
          <IonButton expand="full" onClick={() => setView('about')} color="tertiary">
            Acerca de
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'register') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Registrar Incidencia</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput
            placeholder="Título"
            value={title}
            onIonChange={(e: CustomEvent) => setTitle((e.target as HTMLInputElement).value)}
            style={{ marginBottom: '16px' }}
          />
          <IonDatetimeButton datetime="datetime" />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="datetime"
              presentation="date"
              value={date}
              onIonChange={(e: CustomEvent) => setDate(e.detail.value)}
            />
          </IonModal>
          <IonTextarea
            placeholder="Descripción"
            value={description}
            onIonChange={(e: CustomEvent) => setDescription((e.target as HTMLTextAreaElement).value)}
            style={{ marginBottom: '16px' }}
          />
          <label htmlFor="photo" className="ion-padding-top">Imagen:</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            style={{ display: 'block', marginBottom: '16px' }}
          />
          <label htmlFor="audio">Audio:</label>
          <input
            id="audio"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files ? e.target.files[0] : null)}
            style={{ display: 'block', marginBottom: '16px' }}
          />
          <IonButton expand="full" onClick={handleRegister} color="success">Guardar</IonButton>
          <IonButton expand="full" onClick={() => setView('home')} color="medium">Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'list') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista de Incidencias</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            {incidents.map((incident, index) => (
              <IonItem key={index} style={{ marginBottom: '16px' }}>
                <IonLabel>
                  <h2>{incident.title}</h2>
                  <p>{incident.date}</p>
                  <p>{incident.description}</p>
                  {incident.photo && (
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <IonImg
                        src={incident.photo}
                        style={{
                          width: '80%',
                          maxWidth: '400px',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}
                  {incident.audio && (
                    <audio
                      controls
                      src={incident.audio}
                      style={{ display: 'block', marginTop: '8px', width: '100%' }}
                    />
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
          <IonButton expand="full" color="danger" onClick={() => setShowAlert(true)}>Eliminar Todos los Registros</IonButton>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Confirmar'}
            message={'¿Estás seguro de que quieres eliminar todos los registros? Esta acción no se puede deshacer.'}
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => console.log('Cancelado'),
              },
              {
                text: 'Eliminar',
                handler: handleDeleteAll,
              }
            ]}
          />
          <IonButton expand="full" onClick={() => setView('home')} color="medium">Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'detail') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalles de la Incidencia</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h2>Detalles del Incidente</h2>
          <IonButton expand="full" onClick={() => setView('list')} color="medium">Volver</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (view === 'about') {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Acerca de</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <img
              src="src/assets/a.jpg"
              alt="Cadete Felix"
              style={{
                width: '150px',
                height: 'auto',
                borderRadius: '50%',
                marginBottom: '16px'
              }}
            />
            <h2>Cadete</h2>
            <p>Nombre: Felix Manuel</p>
            <p>Apellido: sanchez de la cruz</p>
            <p>Matrícula: 2022-0049</p>
            <p>Moraleja: "A ojos de Dios nadie se salva"</p>
            <IonButton expand="full" onClick={() => setView('home')} color="medium">Volver</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return null;
};

export default Home;
