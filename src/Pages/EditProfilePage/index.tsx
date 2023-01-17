import { useContext } from 'react';
import { Col, Row } from 'antd';

import ProfileEditForm from '../../Containers/EditProfileForm';
import Navbar from '../../Components/Navbar';
import ScheduleAddForm from '../../Containers/DoctorsSecheduleForm';
import { StyledTitle } from '../../Components/Typography/styles';
import { SessionInfoContext, userType } from '../../SessionInfoContext';

const ProfileEditPage = () => {
  const { accountType } = useContext(SessionInfoContext);

  return (
    <>
      <Navbar />
      <Row gutter={[0, 50]}>
        <Col span={12} offset={6}>
          <StyledTitle>Edit profile</StyledTitle>
          <ProfileEditForm />
        </Col>
        {accountType === userType.DOCTOR && (
          <Col span={12} offset={6}>
            <StyledTitle>Edit work plan</StyledTitle>
            <ScheduleAddForm />
          </Col>
        )}
      </Row>
    </>
  );
};

export default ProfileEditPage;
