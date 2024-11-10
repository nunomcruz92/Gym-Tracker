import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Clock, Dumbbell, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const API_URL = 'https://gym-tracker-backend-110k.onrender.com/api';

const GymTracker = () => {
  // ... (todos os estados permanecem os mesmos)

  // ... (todas as funções permanecem as mesmas até o return)

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

      {/* Mensagens de Erro e Sucesso simplificadas */}
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
            <Select 
              value={newExercise.machineName}
              onValueChange={handleMachineSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma máquina *" />
              </SelectTrigger>
              <SelectContent>
                {machines.map((machine) => (
                  <SelectItem key={machine._id} value={machine.name}>
                    {machine.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  <Plus className="w-4 h-4" />
                  Adicionar Nova Máquina
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Máquina</DialogTitle>
                </DialogHeader>
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
              </DialogContent>
            </Dialog>
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

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-200">
          <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" style={{width: '30%'}} />
        </div>
      )}
    </div>
  );
};

export default GymTracker;