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

export interface PeriodSummary {
    income: number;
    expense: number;
}

function App() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<{ current: PeriodSummary, previous: PeriodSummary } | null>(null);

    const fetchTransactions = async () => {
        const response = await fetch("http://localhost:8080/api/transactions");
        const data = await response.json();
        setTransactions(data);
    };

    const fetchSummary = async () => {
        const response = await fetch("http://localhost:8080/api/transactions/summary");
        const data = await response.json();
        setSummary(data);
    };

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, []);


    return (
        <>
            <h1>FLOWLET</h1>

            {summary && (
                <div>
                    <h2>今期収支</h2>
                    <p>収入: {summary.current.income} 円</p>
                    <p>支出: {summary.current.expense} 円</p>
                    <p>差額: {summary.current.income - summary.current.expense} 円</p>

                    <h2>前期収支</h2>
                    <p>収入: {summary.previous.income} 円</p>
                    <p>支出: {summary.previous.expense} 円</p>
                    <p>差額: {summary.previous.income - summary.previous.expense} 円</p>
                </div>
            )}

            <TransactionForm onSuccess={() => {
                fetchTransactions();
                fetchSummary();
            }}/>

            <TransactionList transactions={transactions}/>
        </>
    );
}

export default App;
