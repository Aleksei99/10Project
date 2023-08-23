import React, {useContext, useEffect, useReducer, useState} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../store/auth-context";

const Login = (props) => {
    // const [enteredEmail, setEnteredEmail] = useState('');
    // const [emailIsValid, setEmailIsValid] = useState();
    // const [enteredPassword, setEnteredPassword] = useState('');
    // const [passwordIsValid, setPasswordIsValid] = useState();
    const [formIsValid, setFormIsValid] = useState(false);
    const ctx = useContext(AuthContext)

    const emailReducer = (state, action) => {
        if (action.type === 'USER_INPUT') {
            return {value: action.val, isValid: action.val.includes('@')}
        }
        if (action.type === 'INPUT_BLUR') {
            return {value: state.value, isValid: state.value.includes('@')}
        }
        return {value: '', isValid: false}
    }

    const passwordReducer = (state, action) => {
        if (action.type === 'PASSWORD_INPUT') {
            return {value: action.val, isValid: action.val.length>6}
        }
        if (action.type === 'INPUT_BLUR') {
            return {value: state.value, isValid: state.value.length>6}
        }
        return {value: '', isValid: false}
    }

    const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: false})
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: false})

    const {isValid:emailIsValid}=emailState
    const {isValid:passwordIsValid}=passwordState

    useEffect(()=>{
      let timeoutIdentifier = setTimeout(()=>{
        console.log('Checking validity')
        setFormIsValid(
            emailIsValid && passwordIsValid
        );
      },1000);
      return () => {
        console.log('CLEANUP')
        clearTimeout(timeoutIdentifier)
      }
    },[emailIsValid,passwordIsValid])

    const emailChangeHandler = (event) => {
        dispatchEmail({type: 'USER_INPUT', val: event.target.value});
        // setFormIsValid(
        //     event.target.value.includes('@') && passwordState.isValid
        // )
    };

    const passwordChangeHandler = (event) => {
        dispatchPassword({type:'PASSWORD_INPUT',val:event.target.value})
        // setEnteredPassword(event.target.value);
        // setFormIsValid(
        //     emailState.isValid && event.target.value.trim().length > 6
        // )
    };

    const validateEmailHandler = () => {
        // setEmailIsValid(emailState.isValid);
        dispatchEmail({type: 'INPUT_BLUR'})
    };

    const validatePasswordHandler = () => {
        //setPasswordIsValid(enteredPassword.trim().length > 6);
        dispatchPassword({type:'INPUT_BLUR'})
    };

    const submitHandler = (event) => {
        event.preventDefault();
        ctx.onLogin(emailState.value, passwordState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        emailState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${
                        passwordState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn} disabled={!formIsValid}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
