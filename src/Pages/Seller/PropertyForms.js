import { Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import React from 'react'
import AddProperty from '../Agent/Agricultural/AddProperty'
import CommercialForm from '../Agent/Commericial/CommercialForm'
import LayoutForm from '../Agent/Layout/LayoutForm'
import ResidentialForm from '../Agent/Residential/ResidentialForm'

const PropertyForms = () => {
  return (
    <div>
      <Tabs defaultActiveKey="agricultural" centered>
        <TabPane tab="Agricultural" key="agricultural">
          <AddProperty />
        </TabPane>
        <TabPane tab="Commercial" key="commercial">
          <CommercialForm />
        </TabPane>
        <TabPane tab="Layout" key="layout">
          <LayoutForm />
        </TabPane>
        <TabPane tab="Residential" key="residential">
          <ResidentialForm />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default PropertyForms
