import { Storage } from '@capacitor/storage';

export const saveIncident = async (incident: any) => {
  const incidents = await getIncidents();
  incidents.push(incident);
  await Storage.set({
    key: 'incidents',
    value: JSON.stringify(incidents),
  });
};

export const getIncidents = async () => {
  const { value } = await Storage.get({ key: 'incidents' });
  return value ? JSON.parse(value) : [];
};

export const deleteAllIncidents = async () => {
  await Storage.remove({ key: 'incidents' });
};
