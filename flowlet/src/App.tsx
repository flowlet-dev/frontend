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
    startDate: string;
    endDate: string;
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
                    <h2>
                        今期（{summary.current.startDate} 〜 {summary.current.endDate}）
                    </h2>
                    <p>収入: {summary.current.income} 円</p>
                    <p>支出: {summary.current.expense} 円</p>

                    {(() => {
                        const diff = summary.current.income - summary.current.expense;

                        return <p style={{color: diff > 0 ? "blue" : diff < 0 ? "red" : "black", fontWeight: "bold"}}>
                            収支: {diff} 円
                        </p>;
                    })()}

                    <h2>
                        前期（{summary.previous.startDate} 〜 {summary.previous.endDate}）
                    </h2>
                    <p>収入: {summary.previous.income} 円</p>
                    <p>支出: {summary.previous.expense} 円</p>

                    {(() => {
                        const diff = summary.previous.income - summary.previous.expense;

                        return <p style={{color: diff > 0 ? "blue" : diff < 0 ? "red" : "black", fontWeight: "bold"}}>
                            収支: {diff} 円
                        </p>;
                    })()}
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
