import { useContext, useEffect, useState } from 'react';
import { Col, DatePicker, Row, Table } from 'antd';
import dayjs from 'dayjs';

import Navbar from '../../Components/Navbar';
import { StyledTitle } from '../../Components/Typography/styles';
import { TitleContext } from '../../Contexts/TitleContext';
import PaginatedSelect from '../../Components/PaginatedSelect';
import fetchAllDoctors from './fetchDoctors';
import { DoctorEmail, DoctorIcon, DoctorInfo, DoctorOption, Paragraph } from './styles';
import { getFetchDoctorProcedures } from './fetchDoctorProcedures';

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Procedure {
  id: number;
  name: string;
  needed_time_min: number;
}

const MakeAppointmentPage = () => {
  const { updateTitle } = useContext(TitleContext);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    updateTitle('Make an appointment');
  }, [updateTitle]);

  const renderOption = (doctor: Doctor) => (
    <DoctorOption>
      <Col>
        <DoctorIcon />
      </Col>
      <DoctorInfo>
        <Paragraph>
          {doctor.first_name} {doctor.last_name}
        </Paragraph>
        <DoctorEmail>{doctor.email}</DoctorEmail>
      </DoctorInfo>
    </DoctorOption>
  );

  return (
    <>
      <Navbar />
      <Row>
        <Col span={8} offset={8}>
          <StyledTitle>Make an appointment</StyledTitle>
          <div>
            <p>Choose a doctor</p>
            <PaginatedSelect<Doctor>
              size="large"
              fetchOptions={fetchAllDoctors}
              values={doctors}
              setValues={(values: Doctor[]) => {
                setDoctors(values);
                setProcedures([]);
              }}
              renderOption={renderOption}
              placeholder="Search for a doctor"
              notFoundContent={(searchValue) => <p>No doctors found for {searchValue}</p>}
            />
            {doctors.length > 0 && (
              <div>
                <p>Choose a procedure</p>
                <PaginatedSelect<Procedure>
                  size="large"
                  fetchOptions={getFetchDoctorProcedures(doctors[0].id)}
                  values={procedures}
                  setValues={setProcedures}
                  renderOption={(procedure) => <>{procedure.name}</>}
                  placeholder="Search for a procedure"
                  notFoundContent={(searchValue) => <p>No procedures found for {searchValue}</p>}
                />
              </div>
            )}
            {procedures.length > 0 && (
              <>
                <div>
                  <p>Choose a date</p>
                  <DatePicker
                    presets={[
                      { label: 'Today', value: dayjs() },
                      { label: 'Tomorrow', value: dayjs().add(1, 'day') },
                      { label: 'Next week', value: dayjs().add(1, 'week') },
                    ]}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    value={date ? dayjs(date) : dayjs()}
                    onChange={(date) => setDate(date?.format('YYYY-MM-DD') || '')}
                  />
                </div>
                <div>
                  <p>Choose a time</p>
                  <Table></Table>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MakeAppointmentPage;
