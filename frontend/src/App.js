import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Clock, Dumbbell, User } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">GymTracker</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="workout">
            <Dumbbell className="mr-2" />
            Treino
          </TabsTrigger>
          <TabsTrigger value="stats">
            <Clock className="mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="machines">
            <Calendar className="mr-2" />
            Máquinas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <Card>
            <CardHeader>
              <CardTitle>Novo Exercício</CardTitle>
              <CardDescription>Registre seu treino de hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome da Máquina"
                    value={newExercise.machineName}
                    onChange={(e) => setNewExercise({...newExercise, machineName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({...newExercise, weight: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Repetições"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Séries"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Notas sobre a máquina"
                    value={newExercise.machineNotes}
                    onChange={(e) => setNewExercise({...newExercise, machineNotes: e.target.value})}
                  />
                </div>
                <Button type="submit">Salvar Exercício</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
              <CardDescription>Acompanhe sua evolução</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart data={exercises} width={800} height={400}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="machines">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map((machine) => (
              <Card key={machine._id}>
                <CardHeader>
                  <CardTitle>{machine.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {machine.image && (
                    <img
                      src={machine.image}
                      alt={machine.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-gray-600">{machine.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GymTracker;