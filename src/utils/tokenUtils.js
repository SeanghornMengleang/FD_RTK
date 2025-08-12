

import {AES, enc} from 'crypto-js'
import secureLocalStorage from 'react-secure-storage';
//
const ENCRYPT_KEY = import.meta.env.ENCRYPTED_KEY;

//
export const encrtypedToken = (encrtyped) => {
        const dataEncrtyped = AES.encrypt(encrtyped,ENCRYPT_KEY).toString();
        secureLocalStorage.setItem(ENCRYPT_KEY, enc.Utf8)
        console.log("=============> AccessToken :", Token);
        return dataEncrtyped;

}

// store accessToken
export const storeAccessToken = (accessToken) => {
    console.log("================> accessToken:  <==========", accessToken);
    const dataEncrtyped = encrtypedToken(accessToken);
    console.log("===========> ", dataEncrtyped)
    const Token = secureLocalStorage.getItem(ENCRYPT_KEY, dataEncrtyped);
    console.log("===============> AccessToken: ",Token);

    if(Token){
        encrtypedToken(Token);
    }
    return null;
}

// descrypted accessToken 
export const descryptedAccessToken = (encrtypedToken) =>{
    if(encrtypedToken){
        const descryptedAccessToken = AES.decrypt(dataEncrtyped, ENCRYPT_KEY);
        return descryptedAccessToken.toString(enc.Utf8);
    }
}

// get
export const getDescryptedAccessToken = () => {
    const encrtypedToken = secureLocalStorage.getItem(ENCRYPT_KEY);
    console.log("The encryptToken: ", encrtypedToken)
    if(encrtypedToken){
        return descryptedAccessToken()
    }
    return null;
}