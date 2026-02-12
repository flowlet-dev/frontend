import {useEffect, useState} from "react";
import "./App.css";
import TransactionForm from "./TransactionForm.tsx";
import TransactionList from "./TransactionList.tsx";

export interface Transaction {
    transactionId: string;
    transactionDate: string;
    amount: number;
    transactionType: string;
    memo: string;
}

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        const response = await fetch("http://localhost:8080/api/transactions");
        const data = await response.json();
        setTransactions(data);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);


    return (
        <>
            <h1>FLOWLET</h1>
            <TransactionForm onSuccess={fetchTransactions}/>
            <TransactionList transactions={transactions}/>
        </>
    );
}

export default App;
