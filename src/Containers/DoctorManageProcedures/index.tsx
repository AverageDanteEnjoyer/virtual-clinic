import { useContext, useState } from 'react';
import { capitalize, lowerCase } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { Spin, Col, Row, Modal, FormItemProps } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import routes from 'routes';
import { Store } from 'store';
import pushNotification from 'pushNotification';
import { getDataFromToken } from 'localStorageAPI';

import useModal from 'Hooks/useModal';

import handleDelete from 'Containers/DoctorManageProcedures/deleteProcedure';
import addProcedure from 'Containers/DoctorManageProcedures/EditForm/addProcedure';
import { DeleteButton, StyledForm, SubmitButton } from 'Containers/DoctorManageProcedures/styles';

import Input from 'Components/Input';
import { Title } from 'Components/Typography';
import PaginatedTable from 'Components/PaginatedTable';
import { EditButton } from 'Containers/WorkPlan/WorkPlanTable/styles';

import EditForm from './EditForm';
import { Procedure } from './fetchProcedures';
import getDoctorProcedures from './fetchProcedures';

interface formItem extends FormItemProps {
  type: string;
}

export interface DoctorProceduresType {
  id: number;
  name: string;
  needed_time_min: number;
}

export interface FormData {
  name: string;
  needed_time_min: number;
}

const DoctorManageProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpened, openModal, closeModal } = useModal();
  const [record, setRecord] = useState<DoctorProceduresType>({ id: 0, name: '', needed_time_min: 0 });
  const [form] = StyledForm.useForm();
  const { userID } = getDataFromToken();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();
  const [tableState, setTableState] = useState(Date.now());

  const onFinish = async (values: FormData) => {
    setLoading(true);
    try {
      const response = await addProcedure(values);
      const responseBody = await response.json();

      if (response.ok) {
        pushNotification('success', 'Success', 'Procedure has been added!');
        form.resetFields();
        setTableState(Date.now());
      } else {
        Object.entries(responseBody.errors).forEach(([key, value]) => {
          const description = `${capitalize(key.replaceAll('_', ' '))} ${value}.`;

          formItems.forEach(({ name }) => {
            key === name && form.setFields([{ name: key, errors: [description] }]);
          });
        });
      }
    } catch {
      dispatch({ type: 'logout' });
      navigate(routes.logIn.path);
    } finally {
      setLoading(false);
    }
  };

  const deleteOnClick = async (record: DoctorProceduresType) => {
    setLoading(true);
    try {
      const response = await handleDelete(record);
      if (response.ok) {
        setTableState(Date.now());
        pushNotification('success', 'Success', 'Procedure has been deleted!');
      }
    } catch {
      dispatch({ type: 'logout' });
      navigate(routes.logIn.path);
    } finally {
      setLoading(false);
    }
  };

  const formItems: formItem[] = [
    {
      name: 'name',
      label: 'Procedure name',
      type: 'text',
      rules: [{ required: true, message: 'Please input procedure name' }],
    },
    {
      name: 'needed_time_min',
      label: 'Procedure time',
      type: 'number',
      rules: [{ required: true, message: 'Please input procedure time' }],
    },
  ];

  const formItemsJSX = formItems.map(({ name, label, type, rules }, idx) => (
    <StyledForm.Item key={idx} label={label} name={name} rules={rules} colon={true}>
      <Input type={type} prefix={null} placeholder={`Enter your ${lowerCase(label as string)}`} min="1" />
    </StyledForm.Item>
  ));

  const columns = [
    {
      title: 'Procedure name',
      dataIndex: 'name',
      key: 'name',
      filtered: true,
    },
    {
      title: 'Procedure time',
      dataIndex: 'needed_time_min',
      key: 'needed_time_min',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: DoctorProceduresType) => {
        return (
          <Row gutter={[5, 5]} justify="center" align="middle">
            <Col>
              <EditButton
                onClick={() => {
                  setRecord(record);
                  openModal();
                }}
              >
                <EditOutlined />
              </EditButton>
            </Col>
            <Col>
              <DeleteButton onClick={async () => await deleteOnClick(record)}>
                <DeleteOutlined />
              </DeleteButton>
            </Col>
          </Row>
        );
      },
    },
  ];

  return (
    <Row gutter={[0, 50]}>
      <Col span={24}>
        <Spin spinning={loading} tip="waiting for server response...">
          <PaginatedTable<Procedure>
            data={procedures}
            setData={setProcedures}
            columns={columns}
            fetchData={getDoctorProcedures(userID || 0)}
            pageSizeOptions={[4]}
            key={tableState}
          />
        </Spin>
      </Col>
      <Col span={24}>
        <Title centered level={2}>
          Add new procedure
        </Title>
        <StyledForm form={form} onFinish={onFinish} autoComplete="off" requiredMark={false} layout="vertical">
          <Row>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
              {formItemsJSX}
            </Col>
            <Col xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
              <SubmitButton size="large" htmlType="submit">
                Submit
              </SubmitButton>
            </Col>
          </Row>
        </StyledForm>
      </Col>
      <Modal title="Edit procedure" onCancel={closeModal} footer={null} open={isOpened} centered>
        <EditForm setTableState={setTableState} procedure={record} closeEditModal={closeModal} />
      </Modal>
    </Row>
  );
};

export default DoctorManageProcedures;
