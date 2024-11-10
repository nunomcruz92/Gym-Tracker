import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Clock, Dumbbell } from 'lucide-react';

const API_URL = 'https://gym-tracker-backend-110k.onrender.com';

const GymTracker = () => {
  const [exercises, setExercises] = useState([]);
  const [machines, setMachines] = useState([]);
  const [activeTab, setActiveTab] = useState('workout');
  const [newExercise, setNewExercise] = useState({
    machineName: '',
    weight: '',
    reps: '',
    sets: '',
    machineImage: '',
    machineNotes: ''
  });

  useEffect(() => {
    fetchExercises();
    fetchMachines();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises`);
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await fetch(`${API_URL}/machines`);
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise)
      });
      if (response.ok) {
        fetchExercises();
        setNewExercise({
          machineName: '',
          weight: '',
          reps: '',
          sets: '',
          machineImage: '',
          machineNotes: ''
        });
      }
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewExercise({ ...newExercise, machineImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">GymTracker</h1>
      
      {/* Tabs */}
      <div className="border-b mb-4">
        <nav className="flex space-x-4">
          {['workout', 'stats', 'machines'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 flex items-center ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'workout' && <Dumbbell className="w-4 h-4 mr-2" />}
              {tab === 'stats' && <Clock className="w-4 h-4 mr-2" />}
              {tab === 'machines' && <Calendar className="w-4 h-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Workout Tab */}
      {activeTab === 'workout' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Novo Exercício</h2>
          <p className="text-gray-600 mb-4">Registre seu treino de hoje</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome da Máquina"
              value={newExercise.machineName}
              onChange={(e) => setNewExercise({...newExercise, machineName: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Peso (kg)"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Repetições"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Séries"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Notas sobre a máquina"
              value={newExercise.machineNotes}
              onChange={(e) => setNewExercise({...newExercise, machineNotes: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Salvar Exercício
            </button>
          </form>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Progresso</h2>
          <p className="text-gray-600 mb-4">Acompanhe sua evolução</p>
          
          <div className="h-96">
            <LineChart data={exercises} width={800} height={400}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      )}

      {/* Machines Tab */}
      {activeTab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((machine, index) => (
            <div key={machine._id || index} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-2">{machine.name}</h3>
              {machine.image && (
                <img
                  src={machine.image}
                  alt={machine.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-gray-600">{machine.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GymTracker;