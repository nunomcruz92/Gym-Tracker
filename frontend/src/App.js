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