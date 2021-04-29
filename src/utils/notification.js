import { store } from 'react-notifications-component';

export const ErrorNotification = (message) => {
    store.addNotification({
        title: 'Error!',
        message: message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true
        }
    });
};

export const SuccessNotification = (message) => {
    store.addNotification({
        title: 'Success!',
        message: message,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true
        }
    });
};