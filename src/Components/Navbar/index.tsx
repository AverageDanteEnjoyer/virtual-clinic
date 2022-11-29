import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Col, Menu, MenuProps, Row } from 'antd';
import { QuestionOutlined, UserOutlined } from '@ant-design/icons';

import ComponentsPage from '../../Pages/ComponentsPage';
import RegistrationPage from '../../Pages/RegistrationPage';

import routes from '../../routes';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, children?: MenuItem[]): MenuItem {
  return {
    label,
    key,
    children,
  } as MenuItem;
}

const Navbar = () => {
  const loggedIn = false; //used for testing, change manually
  const items: MenuItem[] = [
    getItem(<Link to={routes.components}>components</Link>, '1'),
    getItem(<Link to={routes.home}>home</Link>, '2'),
    loggedIn
      ? getItem(<UserOutlined />, 'user', [getItem('Edit profile', '3'), getItem('Appointments', '4')])
      : getItem(
          <Link to={routes.register}>
            <UserOutlined />
          </Link>,
          'user'
        ),
  ];
  return (
    <BrowserRouter>
      <Row align="middle" justify="end">
        <Col flex={1}>
          {/*A place for logo*/}
          <QuestionOutlined />
        </Col>
        <Col>
          <nav>
            <Menu defaultSelectedKeys={['1']} mode="horizontal" theme="light" items={items} />
          </nav>
        </Col>
      </Row>
      <Routes>
        <Route path={routes.home}></Route>
        <Route path={routes.components} element={<ComponentsPage />}></Route>
        <Route path={routes.logIn} element={<p />}></Route>
        <Route path={routes.register} element={<RegistrationPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Navbar;
