import React, { Component } from 'react';
import { Router, Scene, Drawer } from 'react-native-router-flux';
import Init from './app/container/Init';
import Login from './app/container/Login';
import Registration from './app/container/Registration';
import ForgetPassword from './app/container/ForgetPassword';
import Dashboard from './app/container/Dashboard';
import PurchaseOrder from './app/container/PurchaseOrder';
import SideMenu from './app/container/SideMenu';
import Image from './app/utils/images';
import PurchaseOrder2 from './app/container/PurchaseOrder2';
import AddNewPurchaseOrder from './app/container/AddNewPurchaseOrder';
import ApproverList from './app/container/ApproverList';
import LabourList from './app/container/LabourList';
import EquipList from './app/container/EquipmentList';
import MaterialList from './app/container/MaterialList';
import TabBarScreen from './app/container/TabBar';
import Expenses_2 from './app/container/Expenses_2';
import Expenses from './app/container/Expenses';
import EditTimesheetExpenses from './app/container/EditTimesheetExpenses';
import EditTimesheetExpenses_2 from './app/container/EditTimesheetExpenses_2';
import ViewTimesheetForm from './app/container/ViewTimesheetForm';
import EditTimesheet from './app/container/EditTimesheet';
import { Provider } from 'react-redux';
import configureStore from './app/redux/store';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// class tabItemComponent extends Component {

//   render = () => {

//     let color = this.props.selected ? '#004DCF' : 'red';

//     return (
//       <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
//         <Icon style={{ color: color }} name={this.props.iconName} size={20} />
//         {/* <Text style={{ color: color, fontSize: 12 }}>{this.props.title}</Text> */}
//       </View>
//     );
//   }

// }

const store = configureStore();

export class App extends Component {

  render = () => {
    return (
      <Provider store={store}>
        <Router navigationBarStyle={{ backgroundColor: '#007CC4', height: hp('5%') }}>
          <Scene key='root' hideNavBar>
            <Scene key='init'
              component={Init}
              type='replace'
              initial
            />
            <Scene key='login'
              component={Login}
              type='replace'
            />
            <Scene key='registration'
              component={Registration}
              type='replace'
            />
            <Scene key='resendEmail'
              component={ForgetPassword}
              type='replace'
            />
            <Scene key='authenticated' hideNavBar type='replace' panHandlers={null}>
              <Drawer
                key='drawerMenu'
                contentComponent={SideMenu}
                drawerWidth={wp('75%')}
                drawerPosition='left'
                drawerImage={Image.menu2}
                drawerOpenRoute='DrawerOpen'
              >
                {/* <Scene key='main'
                  swipeEnabled={false}
                  tabs={true}
                  lazy
                  tabBarPosition='bottom'
                  showIcon={true}
                  inactiveTintColor='#868E96'
                  indicatorStyle={{ backgroundColor: '#FFFFFF' }}
                  activeTintColor='#3F51B5'
                  tabBarStyle={{ backgroundColor: '#FFFFFF' }}
                  panHandlers={null}
                > */}
                <Scene key='dashboard'
                  component={Dashboard}
                  type='replace'
                  title='Dashboard'
                  titleStyle={{ color: '#FFFFFF', fontSize: hp('2.5%') }}
                //iconName='home'
                //icon={tabItemComponent}
                />
                {/* <Scene key='tabBar'
                      component={TabBarScreen}
                      type='replace'
                      title='Create new Timesheet'
                      titleStyle={{ color: '#FFFFFF' }}
                      rightTitle='Submit'
                      rightButtonTextStyle={{ color: '#FFFFFF', fontSize: 15 }}
                      onRight={() => EventRegister.emit('myCustomEvent4')}
                    //iconName='tags'
                    //icon={tabItemComponent}
                    /> */}
              </Drawer>
              <Scene key='purchseDetail' hideNavBar>
                <Scene key='purchaseOrder'
                  component={PurchaseOrder}
                  type='replace'
                  initial
                />
                <Scene key='addNewPurchaseOrder'
                  component={AddNewPurchaseOrder}
                  type='replace'
                />
                <Scene key='purchaseOrder2'
                  component={PurchaseOrder2}
                  type='replace'
                />
                <Scene
                  key='tabBar'
                  component={TabBarScreen}
                  type='replace'
                  title='Create new Timesheet'
                />
              </Scene>
              <Scene key='approveList' component={ApproverList} type='replace' />
              <Scene key='labourList' component={LabourList} type='replace' />
              <Scene key='equipmentList' component={EquipList} type='replace' />
              <Scene key='materialList' component={MaterialList} type='replace' />
              <Scene key='expenses' component={Expenses} type='replace' />
              <Scene key='expenses_2' component={Expenses_2} type='replace' />
              {/* <Scene key='editTimesheetExpenses' component={EditTimesheetExpenses} type='replace' /> */}
              {/* <Scene key='editTimesheetExpenses_2' component={EditTimesheetExpenses_2} type='replace' /> */}
              <Scene key='viewTimesheetForm' component={ViewTimesheetForm} type='replace' />
              {/* <Scene key='editTimesheet' component={EditTimesheet} type='replace' /> */}
              <Scene key='editTimesheetScene' hideNavBar>
                <Scene key='editTimesheet' component={EditTimesheet} type='replace' initial />
                <Scene key='editTimesheetExpenses' component={EditTimesheetExpenses} type='replace' />
                <Scene key='editTimesheetExpenses_2' component={EditTimesheetExpenses_2} type='replace' />
              </Scene>
            </Scene>
          </Scene>
        </Router>
      </Provider>
    );
  }
}

export default App;


