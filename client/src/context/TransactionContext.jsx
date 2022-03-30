import React,  { useEffect, useState } from 'react';
import {ethers} from 'ethers';

import{ contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

//to access the blockchain, i will create a special function to fetch the ethereum contracts
 const getEthereumContract = () => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const signer = provider.getSigner();
     const transcationContract = new ethers.Contract(contractAddress, contractABI, signer);

     console.log({
         provider,
         signer,
         transactionContract
     });
 }

 export const TransactionProvider = ({ children }) => {
     const [currentAccount, setCurrentAccount] = useState()

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});
    
            //to have access at every single render use line 32
            if(accounts.length){
                setCurrentAccount(accounts[0]);
    
                //getAllTransactions();
            }   else{
                console.log('No accounts found')
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    //connecting wallet
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount}}> 
            {children}
        </TransactionContext.Provider>
    )
 }