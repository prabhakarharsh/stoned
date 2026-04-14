const API_URL = 'http://localhost:3001/api';
const getHeaders = (isFormData = false) => {
  const headers: Record<string, string> = {
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const apiService = {
  async getAlarms() {
    const res = await fetch(`${API_URL}/alarms`, { headers: getHeaders() });
    return res.json();
  },

  async saveAlarm(alarm: any) {
    const res = await fetch(`${API_URL}/alarms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(alarm)
    });
    return res.json();
  },

  async analyzeFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/analyze-file`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    return res.json();
  },

  async uploadRingtone(file: File) {
    const formData = new FormData();
    formData.append('ringtone', file);
    const res = await fetch(`${API_URL}/upload-ringtone`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    return res.json();
  },

  async deleteAlarm(id: number | string) {
    const res = await fetch(`${API_URL}/alarms/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  }
};
