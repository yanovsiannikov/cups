import React, {useEffect, useState} from 'react';

import YandexMaps from './containers/YandexMaps/YandexMaps'
import Header from './components/Header/Header'

import {connect} from 'react-redux'
import {userLogin, userLogout} from "./reducers/actions/actions";


const mapStateToProps = state => ({
    isAuth : state.auth.isAuth,
    userName : state.auth.username
})

function App(props) {

    const [session, setSession] = useState({session : false})

    useEffect(() => {
        async function checkUser() {
            try {
                let res = await fetch('/users/check')                
                res = await res.json()
                setSession({session : true})
                if (res!==false)
                props.login(res.name, res.role, res.tasks)
            } catch (err) {console.log('Connection to server Failed')}
        }
        if (!session.session && !props.isAuth)
            checkUser()
    }, [props, session])

  return (
    <div className="App">
      <Header />
      <YandexMaps />
    </div>
  );
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(userLogout()),
        login: (n,r, tasks) => dispatch(userLogin(n,r, tasks))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
