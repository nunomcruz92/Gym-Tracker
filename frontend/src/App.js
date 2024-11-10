import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Clock, Dumbbell, Plus } from 'lucide-react';

const API_URL = 'https://gym-tracker-backend-110k.onrender.com/api';

const GymTracker = () => {
  const [exercises, setExercises] = useState([]);
  const [machines, setMachines] = useState([]);
  const [activeTab, setActiveTab] = useState('workout');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    image: '',
    notes: ''
  });
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
      setIsLoading(true);
      const response = await fetch(`${API_URL}/exercises`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      setError('Falha ao carregar exercícios. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const response = await fetch(`${API_URL}/machines`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMachines(data);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!newExercise.machineName || !newExercise.weight || !newExercise.reps || !newExercise.sets) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      const exerciseData = {
        ...newExercise,
        date: new Date().toISOString(),
        weight: Number(newExercise.weight),
        reps: Number(newExercise.reps),
        sets: Number(newExercise.sets)
      };

      const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar exercício');
      }

      const result = await response.json();
      setSuccessMessage('Exercício salvo com sucesso!');
      fetchExercises();
      
      setNewExercise({
        machineName: '',
        weight: '',
        reps: '',
        sets: '',
        machineImage: '',
        machineNotes: ''
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      setError('Falha ao salvar exercício. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMachineSubmit = async (e) => {
      e.preventDefault();
      
      if (!newMachine.name) {
        setError('Por favor, preencha o nome da máquina.');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setSuccessMessage('');

        const response = await fetch(`${API_URL}/machines`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMachine)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao salvar máquina');
        }

        await response.json();
        setSuccessMessage('Máquina adicionada com sucesso!');
        await fetchMachines(); // Atualiza a lista de máquinas
        setShowMachineModal(false);
        
        // Limpa o formulário
        setNewMachine({
          name: '',
          image: '',
          notes: ''
        });
      } catch (error) {
        console.error('Erro ao adicionar máquina:', error);
        setError('Falha ao adicionar máquina. Por favor, tente novamente.');
      } finally {
        setIsLoading(false); // Garante que isLoading seja definido como false ao final
      }
    };

  const handleImageUpload = (e, setStateFunction) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStateFunction(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMachineSelect = (e) => {
    const value = e.target.value;
    const selectedMachine = machines.find(m => m.name === value);
    setNewExercise({
      ...newExercise,
      machineName: value,
      machineImage: selectedMachine?.image || '',
      machineNotes: selectedMachine?.notes || ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">GymTracker</h1>
      
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Novo Exercício</h2>
          <p className="text-gray-600 mb-4">Registre seu treino de hoje</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={newExercise.machineName}
              onChange={handleMachineSelect}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione uma máquina *</option>
              {machines.map((machine) => (
                <option key={machine._id} value={machine.name}>
                  {machine.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Peso (kg) *"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Repetições *"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Séries *"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                className="p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? 'Salvando...' : 'Salvar Exercício'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Progresso</h2>
          <p className="text-gray-600 mb-4">Acompanhe sua evolução</p>
          
          {exercises.length > 0 ? (
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
          ) : (
            <p className="text-gray-500">Nenhum exercício registrado ainda.</p>
          )}
        </div>
      )}

      {activeTab === 'machines' && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => setShowMachineModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              Adicionar Nova Máquina
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.length > 0 ? (
              machines.map((machine, index) => (
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
              ))
            ) : (
              <p className="text-gray-500">Nenhuma máquina cadastrada ainda.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal para adicionar máquina */}
      {showMachineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adicionar Nova Máquina</h2>
              <button
                onClick={() => setShowMachineModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleMachineSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome da Máquina *"
                value={newMachine.name}
                onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setNewMachine)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Notas sobre a máquina"
                value={newMachine.notes}
                onChange={(e) => setNewMachine({...newMachine, notes: e.target.value})}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Salvando...' : 'Adicionar Máquina'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-200">
          <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" style={{width: '30%'}} />
        </div>
      )}
    </div>
  );
};

export default GymTracker;