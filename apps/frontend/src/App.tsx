import { useEffect, useState } from 'react'
import { useAstronautFeatures } from './hooks/useAstronautFeatures'
import { Astronaut, AstronautId, AstronautUpdates, NewAstronaut } from '@space/core/astronaut.model.ts';
import { AstronautForm } from './components/AstronautForm';
import { Panel } from './components/Panel';
import { AstronautTable } from './components/AstronautTable';

function App() {
  const astronautUsecases = useAstronautFeatures();

  const [astronauts, setAstronauts] = useState<ReadonlyArray<Astronaut>>();

  const [formState, setFormState] = useState<{isVisible: boolean; editingId?: AstronautId | undefined}>({ isVisible: false });

  useEffect(() => {
    refreshAstronautList();
  }, [])

  const editingAstronaut = astronauts?.find((astronaut) => astronaut.id === formState.editingId);

  const refreshAstronautList = () => {
    astronautUsecases.listAstronauts().then((data) => setAstronauts(data));
  }

  const openForm = (id?: AstronautId) => {
    if (formState.isVisible) {
      return
    };

    if(id!== undefined && !astronauts?.some((a) => a.id === id)){
      return;
    }

    setFormState({ isVisible: true, editingId: id });
  };

  const closeForm = () => setFormState({ isVisible: false, editingId: undefined });

  const handleSubmitAstronaut = (value: NewAstronaut | AstronautUpdates) => {
    const result = (value instanceof NewAstronaut)
      ? astronautUsecases.addAstronaut(value)
      : astronautUsecases.updateAstronaut(value);
    
    result.then(() => {
      closeForm();
      refreshAstronautList();
    })
  }

  const handleDeleteAstronaut = (id: AstronautId): void => {
    astronautUsecases.deleteAstronaut(id)
      .then(refreshAstronautList)
  }

  const actions = (astronaut: Astronaut) => [
    <button key={`edit-${astronaut.id}`} onClick={() => openForm(astronaut.id)} disabled={formState.isVisible}>Edit</button>,
    <button key={`delete-${astronaut.id}`} onClick={() => handleDeleteAstronaut(astronaut.id)}>Delete</button>         
  ]

  return (
    <>
      <h1>Astronauts</h1>
      <button onClick={() => openForm()} disabled={formState.isVisible}>Add Astronaut</button>
      <AstronautTable astronauts={astronauts || []} actions={actions}/>
      <Panel isVisible={formState.isVisible}>
        {formState.isVisible && <AstronautForm
          mode={formState.editingId ? 'edit' : 'add'}
          value={editingAstronaut as Astronaut}
          onCancel={closeForm}
          onSubmit={handleSubmitAstronaut}
        />}
      </Panel>
    </>
  )
}

export default App

              