import { useContext } from 'react';

import RegistrationForm from '../../Containers/RegistrationForm';
import Navbar from '../../Components/Navbar';
import { TitleContext } from '../../Contexts/TitleContext';

const RegistrationPage = () => {
  const { updateTitle } = useContext(TitleContext);

  updateTitle('Virtual Clinic - Register');

  return (
    <>
      <Navbar />
      <RegistrationForm />
    </>
  );
};

export default RegistrationPage;
