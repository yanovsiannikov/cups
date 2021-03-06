import React from 'react'
import {connect} from 'react-redux'
import {userLogin} from '../../reducers/actions/actions'
import {Form, Button, Row, Col} from 'react-bootstrap';
import FormGroup from "react-bootstrap/es/FormGroup";

class SignUp extends React.Component {
    state = {
        validated: false,
        role : '',
        message : ''
    }

    //Проверка правильности заполнения формы
    submitFormHandler = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            //Если неправильно - показать пользователю
            this.setState({validated: true})
        } else
        //Если все "ок" отправить на сервер
            this.submitSignUp(e)
    }

    //Отправка формы на сервер
    submitSignUp = async (e) => {
        let [name, mail, password] = e.target.elements;
        let res = await fetch('/users/signup', {
            method : 'POST',
            headers: {'Content-Type':'application/json'},
            body : JSON.stringify({
                "name" : name.value,
                "password" : password.value,
                "email" : mail.value,
                "role" : this.state.role
            })
        });
        res = await res.json();
        //Если нет сообщения об ошибке то занести данные в redux
        if (!res.message) {
            this.props.login(res) //Добавление данных о пользователе в redux
            this.props.close(); //Закрыть модальное окно
        }
            else this.setState({message : res.message}); //Сообщение об ошибке
    }

    render() {
        const {validated} = this.state;
        return (
            <div>
                <Form noValidate  validated={validated} onSubmit={this.submitFormHandler}>
                    <Form.Text style={{color : 'red'}}>{this.state.message}</Form.Text>
                    <FormGroup>
                        <Form.Label>Логин:</Form.Label>
                        <Form.Control type='text' required/>
                        <Form.Control.Feedback type='invalid'>Введите логин</Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Почта:</Form.Label>
                        <Form.Control type='email' required/>
                        <Form.Control.Feedback type='invalid'>Адрес электронной почты - обязателен</Form.Control.Feedback>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Пароль:</Form.Label>
                        <Form.Control type='password' required/>
                        <Form.Control.Feedback type='invalid'>Введите пароль</Form.Control.Feedback>
                    </FormGroup>
                        <Form.Label>Роль:</Form.Label>
                    <FormGroup as={Row}>
                        <Col sm={6}>
                            <Form.Check onChange={() => this.setState({role : 'worker'})} type='radio' name='role' label='Агент' required/>
                        </Col>
                        <Col sm={6}>
                            <Form.Check onChange={() => this.setState({role : 'author'})} type='radio' name='role' label='Заказчик'/>
                        </Col>
                    </FormGroup>
                    <Button variant="primary" type='submit'>Зарегистрироваться</Button>
                </Form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (user) => dispatch(userLogin(user))
    }
}

export default connect(null,mapDispatchToProps)(SignUp)