import React,  { useEffect, useState } from 'react';
import {ethers} from 'ethers';

import{ contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

//to access the blockchain, i will create a special function to fetch the ethereum contracts
const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
};

 export const TransactionProvider = ({ children }) => {
     const [currentAccount, setCurrentAccount] = useState('');
     const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
     const [isLoading, setIsLoading] = useState(false);
     const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

     const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
     }

     const getAllTransactions = async () => {
      try {
        if (ethereum) {
          const transactionsContract = createEthereumContract();
  
          const availableTransactions = await transactionsContract.getAllTransactions();
  
          const structuredTransactions = availableTransactions.map((transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / (10 ** 18)
          }));
  
          console.log(structuredTransactions);
  
          sendTransaction(structuredTransactions);
        } else {
          console.log("Ethereum is not present");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});
    
            //to have access at every single render use line 32
            if(accounts.length){
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
            }   else{
                console.log('No accounts found')
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    const checkIfTransactionsExist = async () => {
      try {
        if (ethereum) {
          const transactionsContract = createEthereumContract();
          const currentTransactionCount = await transactionsContract.getTransactionCount();
  
          window.localStorage.setItem("transactionCount", currentTransactionCount);
        }
      } catch (error) {
        console.log(error);
  
        throw new Error("No ethereum object");
      }
    };

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

    //logic for sending and storing transactions
    const sendTransaction = async () => {
        try {
          if (ethereum) {
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = createEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: currentAccount,
                to: addressTo,
                gas: "0x5208",
                value: parsedAmount._hex,
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockChain(addressTo, parsedAmount, message, keyword);
    
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
    
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            setTransactionCount(transactionsCount.toNumber());
            window.location.reload();
          } else {
            console.log("No ethereum object");
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}> 
            {children}
        </TransactionContext.Provider>
    )
 }